import {
  createRequire,
} from "node:module";

import {
  mkdtemp,
  readFile,
  rm,
  stat,
} from "node:fs/promises";

import os from "node:os";
import path from "node:path";


const require =
  createRequire(
    import.meta.url
  );


const {
  Sigaa,
} =
  require(
    "sigaa-api"
  );


const SIGAA_URL =
  "https://sigaa.ufpb.br";


const CACHE_DURATION =
  5 * 60 * 1000;


type SigaaSession = {

  account:
    any;

  name:
    string;

  connectedAt:
    number;

  courses?:
    any[];

  filesByCourse?:
    Map<string, any[]>;

  lessonsByCourse?:
    Map<string, any[]>;

  lessonsLoadingByCourse?:
    Map<
      string,
      Promise<any[]>
    >;

  detailCache?:
    Map<
      string,
      {
        createdAt:
          number;

        value:
          any;
      }
    >;

  cache?:
    {
      createdAt:
        number;

      value:
        SigaaOverview;
    };

  enriching?:
    boolean;

  enrichmentPromise?:
    Promise<void>;

};


type SigaaCourse = {

  id:
    string;

  name:
    string;

  code:
    string;

  period:
    string;

  schedule:
    string;

};


type SigaaNotice = {

  id:
    string;

  title:
    string;

  course:
    string;

  date:
    string |
    null;

  content:
    string;

};


type SigaaPriority = {

  id:
    string;

  kind:
    "exam" |
    "homework";

  title:
    string;

  course:
    string;

  courseId:
    string;

  date:
    string;

  daysLeft:
    number;

  urgency:
    "critical" |
    "high" |
    "attention";

};


type SigaaOverview = {

  connected:
    true;

  student: {

    name:
      string;

    registration:
      string;

    program:
      string;

    period:
      string;

  };

  courses:
    SigaaCourse[];

  notices:
    SigaaNotice[];

  priorities:
    SigaaPriority[];

  schedule:
    Record<
      string,
      Array<
        SigaaCourse & {
          day:
            string;

          shift:
            string |
            null;

          classes:
            string |
            null;

          scheduleCode:
            string;
        }
      >
    >;

  updatedAt:
    string;

};


const sessions =
  new Map<
    number,
    SigaaSession
  >();


function createSigaaClient() {

  return new Sigaa({

    url:
      SIGAA_URL,

    institution:
      "UFPB",

  });

}


async function withTimeout<T>(
  promise:
    Promise<T>,
  milliseconds:
    number,
  message:
    string
): Promise<T> {

  let timer:
    NodeJS.Timeout |
    undefined;


  const timeout =
    new Promise<T>(
      function (
        _resolve,
        reject
      ) {

        timer =
          setTimeout(
            function () {

              reject(
                new Error(
                  message
                )
              );

            },
            milliseconds
          );

      }
    );


  try {

    return await Promise.race([
      promise,
      timeout,
    ]);

  }
  finally {

    if (timer) {

      clearTimeout(
        timer
      );

    }

  }

}


function publicError(
  error:
    unknown
) {

  const message =
    error instanceof Error
      ? error.message
      : String(
          error ||
          ""
        );


  const normalized =
    message.toLowerCase();


  if (
    normalized.includes(
      "password"
    ) ||
    normalized.includes(
      "senha"
    ) ||
    normalized.includes(
      "login"
    ) ||
    normalized.includes(
      "credential"
    )
  ) {

    return (
      "Nao foi possivel autenticar no SIGAA. " +
      "Confira usuario e senha."
    );

  }


  if (
    normalized.includes(
      "timeout"
    ) ||
    normalized.includes(
      "tempo"
    )
  ) {

    return (
      "O SIGAA demorou demais para responder."
    );

  }


  return (
    "Nao foi possivel comunicar com o SIGAA da UFPB."
  );

}


async function safeLogout(
  account:
    any
) {

  try {

    if (
      account &&
      typeof account.logoff ===
        "function"
    ) {

      await withTimeout(
        account.logoff(),
        8000,
        "Timeout no logout."
      );

    }

  }
  catch {

    // Sessao remota pode ja ter expirado.

  }

}


function parseSchedule(
  courses:
    SigaaCourse[]
) {

  const days:
    Record<
      string,
      string
    > = {

      "2":
        "Segunda",

      "3":
        "Terca",

      "4":
        "Quarta",

      "5":
        "Quinta",

      "6":
        "Sexta",

      "7":
        "Sabado",

    };


  const shifts:
    Record<
      string,
      string
    > = {

      M:
        "Manha",

      T:
        "Tarde",

      N:
        "Noite",

    };


  const result:
    Record<
      string,
      any[]
    > = {

      Segunda: [],
      Terca: [],
      Quarta: [],
      Quinta: [],
      Sexta: [],
      Sabado: [],
      Outros: [],

    };


  for (
    const course
    of courses
  ) {

    const raw =
      String(
        course.schedule ||
        ""
      ).trim();


    const matches =
      Array.from(
        raw.matchAll(
          /([2-7]+)([MTN])([1-6]+)/g
        )
      );


    if (
      matches.length ===
      0
    ) {

      if (raw) {

        result.Outros.push({

          ...course,

          day:
            "Outros",

          shift:
            null,

          classes:
            null,

          scheduleCode:
            raw,

        });

      }


      continue;

    }


    for (
      const match
      of matches
    ) {

      const dayNumbers =
        match[1];

      const shiftCode =
        match[2];

      const classNumbers =
        match[3];


      for (
        const dayNumber
        of dayNumbers
      ) {

        const day =
          days[
            dayNumber
          ];


        if (!day) {
          continue;
        }


        result[
          day
        ].push({

          ...course,

          day,

          shift:
            shifts[
              shiftCode
            ] ||
            shiftCode,

          classes:
            classNumbers,

          scheduleCode:
            match[0],

        });

      }

    }

  }


  return result;

}


async function readNotice(
  notice:
    any,
  course:
    any
): Promise<SigaaNotice> {

  const [
    dateResult,
    contentResult,
  ] =
    await Promise.allSettled([
      withTimeout<any>(
        notice.getDate(),
        4500,
        "Timeout em aviso."
      ),
      withTimeout(
        notice.getContent(),
        4500,
        "Timeout no conteudo."
      ),
    ]);


  let date:
    string |
    null =
    null;


  if (
    dateResult.status ===
    "fulfilled"
  ) {

    const parsed =
      new Date(
        dateResult.value
      );


    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {

      date =
        parsed.toISOString();

    }

  }


  const content =
    contentResult.status ===
      "fulfilled"
      ? String(
          contentResult.value ||
          ""
        )
          .replace(
            /\s+/g,
            " "
          )
          .trim()
          .slice(
            0,
            1200
          )
      : "";


  return {

    id:
      String(
        notice.id ||
        ""
      ),

    title:
      String(
        notice.title ||
        "Aviso"
      ),

    course:
      String(
        course.title ||
        ""
      ),

    date,

    content,

  };

}


function isoDate(
  value:
    any
) {

  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date.toISOString();

}


function safeText(
  value:
    any,
  maxLength =
    4000
) {

  return String(
    value == null
      ? ""
      : value
  )
    .replace(
      /\s+/g,
      " "
    )
    .trim()
    .slice(
      0,
      maxLength
    );

}


async function loadStudentCourses(
  session:
    SigaaSession
) {

  if (
    session.courses &&
    session.courses.length
  ) {

    return session.courses;

  }


  const bonds =
    await withTimeout(
      session.account
        .getActiveBonds(),
      15000,
      "Timeout ao carregar vinculos."
    );


  const studentBond =
    Array
      .from(
        bonds as any[]
      )
      .find(
        function (
          bond:
            any
        ) {

          return (
            bond.type ===
            "student"
          );

        }
      ) as any;


  if (!studentBond) {

    throw new Error(
      "Nenhum vinculo ativo de estudante foi encontrado."
    );

  }


  const rawCourses =
    await withTimeout(
      studentBond
        .getCourses(),
      18000,
      "Timeout ao carregar turmas."
    );


  session.courses =
    Array.from(
      rawCourses as any[]
    );


  return session.courses;

}


async function findCourse(
  session:
    SigaaSession,
  courseId:
    string
) {

  const courses =
    await loadStudentCourses(
      session
    );


  return courses.find(
    function (
      course:
        any
    ) {

      return (
        String(
          course.id ||
          ""
        ) ===
        courseId
      );

    }
  );

}


async function safeCourseSection(
  name:
    string,
  loader:
    () => Promise<any>
) {

  try {

    return {
      available:
        true,

      data:
        await withTimeout(
          loader(),
          15000,
          "Timeout em " +
          name +
          "."
        ),
    };

  }
  catch (
    error
  ) {

    console.warn(
      "SIGAA course section:",
      name,
      error instanceof Error
        ? error.message
        : String(error)
    );


    return {
      available:
        false,

      data:
        null,

      error:
        "Esta informacao nao esta disponivel no SIGAA para esta turma.",
    };

  }

}


function serializeGrades(
  groups:
    any[]
) {

  return groups.map(
    function (
      group:
        any
    ) {

      return {
        name:
          safeText(
            group.name,
            180
          ),

        type:
          safeText(
            group.type,
            80
          ),

        value:
          typeof group.value ===
            "number"
            ? group.value
            : null,

        grades:
          Array.isArray(
            group.grades
          )
            ? group.grades.map(
                function (
                  grade:
                    any
                ) {

                  return {
                    name:
                      safeText(
                        grade.name,
                        180
                      ),

                    code:
                      safeText(
                        grade.code,
                        80
                      ),

                    value:
                      typeof grade.value ===
                        "number"
                        ? grade.value
                        : null,

                    weight:
                      typeof grade.weight ===
                        "number"
                        ? grade.weight
                        : null,

                    maxValue:
                      typeof grade.maxValue ===
                        "number"
                        ? grade.maxValue
                        : null,
                  };

                }
              )
            : [],
      };

    }
  );

}


function serializeSyllabus(
  syllabus:
    any
) {

  if (!syllabus) {
    return null;
  }


  return {
    methods:
      safeText(
        syllabus.methods,
        6000
      ),

    assessmentProcedures:
      safeText(
        syllabus.assessmentProcedures,
        6000
      ),

    attendanceSchedule:
      safeText(
        syllabus.attendanceSchedule,
        4000
      ),

    schedule:
      Array.isArray(
        syllabus.schedule
      )
        ? syllabus.schedule
            .slice(
              0,
              80
            )
            .map(
              function (
                item:
                  any
              ) {

                return {
                  description:
                    safeText(
                      item.description,
                      1200
                    ),

                  startDate:
                    isoDate(
                      item.startDate
                    ),

                  endDate:
                    isoDate(
                      item.endDate
                    ),
                };

              }
            )
        : [],

    evaluations:
      Array.isArray(
        syllabus.evaluations
      )
        ? syllabus.evaluations
            .slice(
              0,
              30
            )
            .map(
              function (
                item:
                  any
              ) {

                return {
                  description:
                    safeText(
                      item.description,
                      500
                    ),

                  date:
                    isoDate(
                      item.date
                    ),
                };

              }
            )
        : [],

    basicReferences:
      Array.isArray(
        syllabus.basicReferences
      )
        ? syllabus.basicReferences
            .slice(
              0,
              40
            )
            .map(
              function (
                item:
                  any
              ) {

                return {
                  type:
                    safeText(
                      item.type,
                      100
                    ),

                  description:
                    safeText(
                      item.description,
                      1200
                    ),
                };

              }
            )
        : [],

    supplementaryReferences:
      Array.isArray(
        syllabus.supplementaryReferences
      )
        ? syllabus.supplementaryReferences
            .slice(
              0,
              40
            )
            .map(
              function (
                item:
                  any
              ) {

                return {
                  type:
                    safeText(
                      item.type,
                      100
                    ),

                  description:
                    safeText(
                      item.description,
                      1200
                    ),
                };

              }
            )
        : [],
  };

}


/* CORTEX SIGAA RESILIENT RESOURCES V6 */

function safeExternalUrl(
  value:
    any
) {

  try {

    const url =
      new URL(
        String(
          value ||
          ""
        )
      );


    if (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    ) {

      return url.toString();

    }

  }
  catch (
    error
  ) {}


  return null;

}


async function loadCourseLessons(
  session:
    SigaaSession,
  course:
    any,
  courseId:
    string,
  force =
    false
) {

  session.lessonsByCourse ??=
    new Map();

  session.lessonsLoadingByCourse ??=
    new Map();


  if (
    !force &&
    session.lessonsByCourse.has(
      courseId
    )
  ) {

    return (
      session.lessonsByCourse.get(
        courseId
      ) ||
      []
    );

  }


  if (
    !force &&
    session.lessonsLoadingByCourse.has(
      courseId
    )
  ) {

    return (
      session.lessonsLoadingByCourse.get(
        courseId
      ) as Promise<any[]>
    );

  }


  const promise =
    withTimeout(
      course.getLessons(),
      22000,
      "Timeout ao carregar aulas e anexos."
    )
      .then(
        function (
          value
        ) {

          const lessons =
            Array.from(
              value as any[]
            );


          session.lessonsByCourse?.set(
            courseId,
            lessons
          );


          return lessons;

        }
      )
      .finally(
        function () {

          session.lessonsLoadingByCourse?.delete(
            courseId
          );

        }
      );


  session.lessonsLoadingByCourse.set(
    courseId,
    promise
  );


  return promise;

}


function isDownloadableSigaaFile(
  file:
    any
) {

  const id =
    safeText(
      file?.id,
      200
    );


  const key =
    safeText(
      file?.key,
      1000
    );


  const form =
    file?.form;


  const httpSession =
    file?.http
      ?.httpSession;


  const hasAuthenticatedSession =
    Boolean(
      httpSession &&
      typeof httpSession
        .getURL ===
        "function" &&
      typeof httpSession
        .afterHTTPOptions ===
        "function"
    );


  const hasPostDownload =
    Boolean(
      form?.action?.href &&
      form?.postValues
    );


  const hasKeyDownload =
    Boolean(
      id &&
      key
    );


  /*
   * So expomos como arquivo baixavel o item que possui
   * dados suficientes para refazer o download autenticado
   * diretamente no SIGAA.
   */
  return Boolean(
    file?.type ===
      "file" &&
    id &&
    hasAuthenticatedSession &&
    (
      hasPostDownload ||
      hasKeyDownload
    )
  );

}


function sigaaFileKind(
  value:
    any
) {

  const title =
    safeText(
      value,
      300
    )
      .toLowerCase();


  if (/\.pdf(?:$|[?#\s])/.test(title)) {

    return {
      kind:
        "PDF",

      extension:
        "pdf",
    };

  }


  if (/\.docx?(?:$|[?#\s])/.test(title)) {

    return {
      kind:
        "WORD",

      extension:
        title.includes(
          ".docx"
        )
          ? "docx"
          : "doc",
    };

  }


  if (/\.pptx?(?:$|[?#\s])/.test(title)) {

    return {
      kind:
        "SLIDE",

      extension:
        title.includes(
          ".pptx"
        )
          ? "pptx"
          : "ppt",
    };

  }


  if (/\.xlsx?(?:$|[?#\s])/.test(title)) {

    return {
      kind:
        "PLANILHA",

      extension:
        title.includes(
          ".xlsx"
        )
          ? "xlsx"
          : "xls",
    };

  }


  if (/\.zip(?:$|[?#\s])/.test(title)) {

    return {
      kind:
        "ZIP",

      extension:
        "zip",
    };

  }


  return {
    kind:
      "ARQUIVO",

    extension:
      "",
  };

}


function lessonFiles(
  lessons:
    any[]
) {

  const result:
    any[] = [];


  for (
    const lesson
    of lessons
  ) {

    const attachments =
      Array.isArray(
        lesson?.attachments
      )
        ? lesson.attachments
        : [];


    for (
      const attachment
      of attachments
    ) {

      if (
        isDownloadableSigaaFile(
          attachment
        )
      ) {

        result.push(
          attachment
        );

      }

    }

  }


  return result;

}


function uniqueFiles(
  files:
    any[]
) {

  const result:
    any[] = [];


  const used =
    new Set<string>();


  files.forEach(
    function (
      file:
        any,
      index:
        number
    ) {

      const id =
        safeText(
          file?.id,
          200
        );


      const title =
        safeText(
          file?.title,
          240
        );


      const key =
        id
          ? "id:" + id
          : "fallback:" +
            title +
            ":" +
            index;


      if (
        used.has(
          key
        )
      ) {

        return;

      }


      used.add(
        key
      );


      result.push(
        file
      );

    }
  );


  return result;

}


async function loadCourseFiles(
  session:
    SigaaSession,
  course:
    any,
  courseId:
    string,
  force =
    false
) {

  session.filesByCourse ??=
    new Map();


  if (
    !force &&
    session.filesByCourse.has(
      courseId
    )
  ) {

    return (
      session.filesByCourse.get(
        courseId
      ) ||
      []
    );

  }


  let directFiles:
    any[] = [];


  let lessons:
    any[] = [];


  let directError:
    unknown = null;


  let lessonsError:
    unknown = null;


  try {

    directFiles =
      Array.from(
        await withTimeout(
          course.getFiles(),
          20000,
          "Timeout ao carregar a aba de arquivos."
        ) as any[]
      );

  }
  catch (
    error
  ) {

    directError =
      error;


    console.warn(
      "SIGAA files tab:",
      error instanceof Error
        ? error.message
        : String(
            error
          )
    );

  }


  try {

    lessons =
      await loadCourseLessons(
        session,
        course,
        courseId,
        force
      );

  }
  catch (
    error
  ) {

    lessonsError =
      error;


    console.warn(
      "SIGAA lesson attachments:",
      error instanceof Error
        ? error.message
        : String(
            error
          )
    );

  }


  if (
    directError &&
    lessonsError
  ) {

    throw directError;

  }


  /*
   * O SIGAA pode publicar arquivos de duas formas:
   * na aba "Arquivos" ou anexados aos topicos de aula.
   * O Cortex une as duas fontes para nao perder materiais.
   */
  const files =
    uniqueFiles(
      [
        ...directFiles,
        ...lessonFiles(
          lessons
        ),
      ]
    )
      .filter(
        isDownloadableSigaaFile
      );


  session.filesByCourse.set(
    courseId,
    files
  );


  return files;

}


function normalizeSigaaFileTitle(
  value:
    any
) {

  return safeText(
    value,
    500
  )
    .normalize(
      "NFKC"
    )
    .trim()
    .toLocaleLowerCase(
      "pt-BR"
    );

}


function serializeCourseFile(
  file:
    any,
  sourceKind:
    "course" |
    "lesson",
  lessonId:
    string |
    null = null
) {

  const id =
    safeText(
      file?.id,
      200
    );


  const fileMeta =
    sigaaFileKind(
      file?.title
    );


  return {
    id,

    sourceKind,

    lessonId,

    kind:
      fileMeta.kind,

    extension:
      fileMeta.extension,

    verified:
      isDownloadableSigaaFile(
        file
      ),

    title:
      safeText(
        file?.title ||
        "Arquivo",
        240
      ),

    description:
      safeText(
        file?.description,
        1000
      ),

    source:
      sourceKind ===
        "lesson"
        ? "Anexo de aula"
        : "Arquivos da disciplina",

    downloadable:
      isDownloadableSigaaFile(
        file
      ),
  };

}


function serializeLessonAttachment(
  attachment:
    any,
  lessonId:
    string |
    null = null
) {

  const type =
    safeText(
      attachment?.type ||
      "recurso",
      80
    );


  const id =
    safeText(
      attachment?.id,
      200
    );


  const externalUrl =
    safeExternalUrl(
      attachment?.href ||
      attachment?.src
    );


  const fileMeta =
    sigaaFileKind(
      attachment?.title ||
      attachment?.name
    );


  return {
    id,
    type,

    sourceKind:
      type ===
        "file"
        ? "lesson"
        : null,

    lessonId,

    kind:
      type ===
        "file"
        ? fileMeta.kind
        : type.toUpperCase(),

    extension:
      type ===
        "file"
        ? fileMeta.extension
        : "",

    verifiedFile:
      isDownloadableSigaaFile(
        attachment
      ),

    title:
      safeText(
        attachment?.title ||
        attachment?.name ||
        "Recurso",
        240
      ),

    description:
      safeText(
        attachment?.description,
        1000
      ),

    url:
      externalUrl,

    downloadable:
      isDownloadableSigaaFile(
        attachment
      ),
  };

}

export async function sigaaCourseDetail(
  userId:
    number,
  courseId:
    string,
  force:
    boolean
) {

  const session =
    sessions.get(
      userId
    );


  if (!session) {

    return {
      status:
        409,

      data: {
        connected:
          false,

        error:
          "Conecte sua conta do SIGAA primeiro.",
      },
    };

  }


  if (
    !courseId ||
    courseId.length > 200
  ) {

    return {
      status:
        400,

      data: {
        error:
          "Turma invalida.",
      },
    };

  }


  session.detailCache ??=
    new Map();


  if (
    force
  ) {

    session.detailCache.delete(
      courseId
    );


    session.filesByCourse?.delete(
      courseId
    );


    session.lessonsByCourse?.delete(
      courseId
    );

  }


  const cached =
    session.detailCache.get(
      courseId
    );


  if (
    !force &&
    cached &&
    (
      Date.now() -
      cached.createdAt
    ) <
    CACHE_DURATION
  ) {

    return {
      status:
        200,

      data: {
        ...cached.value,

        cached:
          true,
      },
    };

  }


  try {

    const course =
      await findCourse(
        session,
        courseId
      );


    if (!course) {

      return {
        status:
          404,

        data: {
          error:
            "Disciplina nao encontrada nesta sessao do SIGAA.",
        },
      };

    }


    const [
      grades,
      absences,
      files,
      exams,
      homeworks,
      lessons,
      syllabus,
    ] =
      await Promise.all([
        safeCourseSection(
                "notas",
                async function () {
        
                  const groups =
                    await course
                      .getGrades();
        
        
                  return serializeGrades(
                    Array.from(
                      groups as any[]
                    )
                  );
        
                }
              ),

        safeCourseSection(
                "frequencia",
                async function () {
        
                  const value =
                    await course
                      .getAbsence();
        
        
                  return {
                    totalAbsences:
                      Number(
                        value.totalAbsences ||
                        0
                      ),
        
                    maxAbsences:
                      Number(
                        value.maxAbsences ||
                        0
                      ),
        
                    list:
                      Array.isArray(
                        value.list
                      )
                        ? value.list
                            .slice(
                              0,
                              100
                            )
                            .map(
                              function (
                                item:
                                  any
                              ) {
        
                                return {
                                  date:
                                    isoDate(
                                      item.date
                                    ),
        
                                  numOfAbsences:
                                    Number(
                                      item.numOfAbsences ||
                                      0
                                    ),
                                };
        
                              }
                            )
                        : [],
                  };
        
                }
              ),

        safeCourseSection(
                "arquivos",
                async function () {
        
                  let directFiles:
                    any[] = [];
        
        
                  let rawLessons:
                    any[] = [];
        
        
                  try {
        
                    directFiles =
                      Array.from(
                        await withTimeout(
                          course.getFiles(),
                          20000,
                          "Timeout ao carregar a aba de arquivos."
                        ) as any[]
                      )
                        .filter(
                          isDownloadableSigaaFile
                        );
        
                  }
                  catch (
                    error
                  ) {
        
                    console.warn(
                      "SIGAA direct files detail:",
                      error instanceof Error
                        ? error.message
                        : String(
                            error
                          )
                    );
        
                  }
        
        
                  try {
        
                    rawLessons =
                      await loadCourseLessons(
                        session,
                        course,
                        courseId,
                        force
                      );
        
                  }
                  catch (
                    error
                  ) {
        
                    console.warn(
                      "SIGAA lesson files detail:",
                      error instanceof Error
                        ? error.message
                        : String(
                            error
                          )
                    );
        
                  }
        
        
                  const serialized:
                    any[] = [];
        
        
                  const used =
                    new Set<string>();
        
        
                  const add =
                    function (
                      file:
                        any,
                      sourceKind:
                        "course" |
                        "lesson",
                      lessonId:
                        string |
                        null
                    ) {
        
                      const id =
                        safeText(
                          file?.id,
                          200
                        );
        
        
                      const title =
                        safeText(
                          file?.title,
                          240
                        );
        
        
                      const key =
                        [
                          sourceKind,
                          lessonId ||
                            "",
                          id,
                          normalizeSigaaFileTitle(
                            title
                          ),
                        ].join(
                          ":"
                        );
        
        
                      if (
                        !id ||
                        used.has(
                          key
                        )
                      ) {
                        return;
                      }
        
        
                      used.add(
                        key
                      );
        
        
                      serialized.push(
                        serializeCourseFile(
                          file,
                          sourceKind,
                          lessonId
                        )
                      );
        
                    };
        
        
                  directFiles
                    .forEach(
                      function (
                        file:
                          any
                      ) {
        
                        add(
                          file,
                          "course",
                          null
                        );
        
                      }
                    );
        
        
                  rawLessons
                    .forEach(
                      function (
                        lesson:
                          any
                      ) {
        
                        const lessonId =
                          safeText(
                            lesson?.id,
                            200
                          );
        
        
                        const attachments =
                          Array.isArray(
                            lesson?.attachments
                          )
                            ? lesson.attachments
                            : [];
        
        
                        attachments
                          .filter(
                            isDownloadableSigaaFile
                          )
                          .forEach(
                            function (
                              file:
                                any
                            ) {
        
                              add(
                                file,
                                "lesson",
                                lessonId ||
                                  null
                              );
        
                            }
                          );
        
                      }
                    );
        
        
                  return serialized
                    .slice(
                      0,
                      250
                    );
        
                }
              ),

        safeCourseSection(
                "avaliacoes",
                async function () {
        
                  const list =
                    Array.from(
                      await course
                        .getExamCalendar() as any[]
                    );
        
        
                  return list
                    .slice(
                      0,
                      40
                    )
                    .map(
                      function (
                        exam:
                          any
                      ) {
        
                        return {
                          description:
                            safeText(
                              exam.description,
                              500
                            ),
        
                          date:
                            isoDate(
                              exam.date
                            ),
                        };
        
                      }
                    );
        
                }
              ),

        safeCourseSection(
                "tarefas",
                async function () {
        
                  const list =
                    Array.from(
                      await course
                        .getHomeworks() as any[]
                    );
        
        
                  return list
                    .slice(
                      0,
                      60
                    )
                    .map(
                      function (
                        homework:
                          any
                      ) {
        
                        return {
                          id:
                            String(
                              homework.id ||
                              ""
                            ),
        
                          title:
                            safeText(
                              homework.title ||
                              "Tarefa",
                              300
                            ),
        
                          startDate:
                            isoDate(
                              homework.startDate
                            ),
        
                          endDate:
                            isoDate(
                              homework.endDate
                            ),
                        };
        
                      }
                    );
        
                }
              ),

        safeCourseSection(
                "aulas",
                async function () {
        
                  const list =
                    await loadCourseLessons(
                      session,
                      course,
                      courseId,
                      force
                    );
        
        
                  return list
                    .slice(
                      0,
                      120
                    )
                    .map(
                      function (
                        lesson:
                          any
                      ) {
        
                        return {
                          id:
                            String(
                              lesson.id ||
                              ""
                            ),
        
                          title:
                            safeText(
                              lesson.title ||
                              "Aula",
                              300
                            ),
        
                          content:
                            safeText(
                              lesson.contentText,
                              3500
                            ),
        
                          startDate:
                            isoDate(
                              lesson.startDate
                            ),
        
                          endDate:
                            isoDate(
                              lesson.endDate
                            ),
        
                          attachments:
                            Array.isArray(
                              lesson.attachments
                            )
                              ? lesson.attachments
                                  .slice(
                                    0,
                                    50
                                  )
                                  .map(
                                    function (
                                      attachment:
                                        any
                                    ) {
        
                                      return serializeLessonAttachment(
                                        attachment,
                                        String(
                                          lesson.id ||
                                          ""
                                        ) ||
                                        null
                                      );
        
                                    }
                                  )
                              : [],
                        };
        
                      }
                    );
        
                }
              ),

        safeCourseSection(
                "plano de ensino",
                async function () {
        
                  return serializeSyllabus(
                    await course
                      .getSyllabus()
                  );
        
                }
              ),
      ]);

    const detail = {
      connected:
        true,

      course: {
        id:
          String(
            course.id ||
            ""
          ),

        name:
          String(
            course.title ||
            "Turma"
          ),

        code:
          String(
            course.code ||
            ""
          ),

        period:
          String(
            course.period ||
            ""
          ),

        schedule:
          String(
            course.schedule ||
            ""
          ),

        numberOfStudents:
          Number(
            course.numberOfStudents ||
            0
          ),
      },

      sections: {
        grades,
        absences,
        files,
        exams,
        homeworks,
        lessons,
        syllabus,
      },

      updatedAt:
        new Date()
          .toISOString(),
    };


    session.detailCache.set(
      courseId,
      {
        createdAt:
          Date.now(),

        value:
          detail,
      }
    );


    return {
      status:
        200,

      data: {
        ...detail,

        cached:
          false,
      },
    };

  }
  catch (
    error
  ) {

    console.error(
      "SIGAA course detail:",
      error instanceof Error
        ? error.message
        : String(error)
    );


    return {
      status:
        502,

      data: {
        error:
          publicError(
            error
          ),
      },
    };

  }

}


function contentTypeForFile(
  filename:
    string
) {

  const extension =
    path.extname(
      filename
    )
      .toLowerCase();


  const types:
    Record<
      string,
      string
    > = {
      ".pdf":
        "application/pdf",

      ".doc":
        "application/msword",

      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      ".ppt":
        "application/vnd.ms-powerpoint",

      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      ".xls":
        "application/vnd.ms-excel",

      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      ".txt":
        "text/plain; charset=utf-8",

      ".zip":
        "application/zip",

      ".png":
        "image/png",

      ".jpg":
        "image/jpeg",

      ".jpeg":
        "image/jpeg",
    };


  return (
    types[
      extension
    ] ||
    "application/octet-stream"
  );

}


function validarArquivoSigaaBaixado(
  buffer:
    Buffer,
  filename:
    string
) {

  if (
    !buffer ||
    buffer.length <
      4
  ) {
    return false;
  }


  const inicioTexto =
    buffer
      .subarray(
        0,
        Math.min(
          buffer.length,
          512
        )
      )
      .toString(
        "utf8"
      )
      .trimStart()
      .toLowerCase();


  /*
   * Nunca aceitar pagina HTML, tela de login, erro ou
   * redirecionamento salvo com nome de PDF/Word.
   */
  if (
    inicioTexto.startsWith(
      "<!doctype html"
    ) ||
    inicioTexto.startsWith(
      "<html"
    ) ||
    inicioTexto.includes(
      "<form"
    ) &&
    (
      inicioTexto.includes(
        "login"
      ) ||
      inicioTexto.includes(
        "senha"
      ) ||
      inicioTexto.includes(
        "sigaa"
      )
    )
  ) {
    return false;
  }


  const extension =
    path.extname(
      filename
    )
      .toLowerCase();


  const startsWith =
    function (
      signature:
        number[]
    ) {

      return signature.every(
        function (
          value,
          index
        ) {

          return (
            buffer[index] ===
            value
          );

        }
      );

    };


  if (
    extension ===
      ".pdf"
  ) {
    return buffer
      .subarray(
        0,
        5
      )
      .toString(
        "ascii"
      ) ===
      "%PDF-";
  }


  if (
    extension ===
      ".docx" ||
    extension ===
      ".xlsx" ||
    extension ===
      ".pptx" ||
    extension ===
      ".zip"
  ) {
    return startsWith([
      0x50,
      0x4b,
    ]);
  }


  if (
    extension ===
      ".doc" ||
    extension ===
      ".xls" ||
    extension ===
      ".ppt"
  ) {
    return startsWith([
      0xd0,
      0xcf,
      0x11,
      0xe0,
      0xa1,
      0xb1,
      0x1a,
      0xe1,
    ]);
  }


  if (
    extension ===
      ".png"
  ) {
    return startsWith([
      0x89,
      0x50,
      0x4e,
      0x47,
    ]);
  }


  if (
    extension ===
      ".jpg" ||
    extension ===
      ".jpeg"
  ) {
    return startsWith([
      0xff,
      0xd8,
      0xff,
    ]);
  }


  /*
   * Para outros formatos, a verificacao principal e nao ser
   * HTML/login e ter conteudo real.
   */
  return buffer.length >
    16;

}


async function directAuthenticatedSigaaDownload(
  file:
    any,
  tempDirectory:
    string
) {

  const internalHttp =
    file?.http;


  const httpSession =
    internalHttp?.httpSession;


  if (
    !httpSession ||
    typeof httpSession
      .getURL !==
      "function" ||
    typeof httpSession
      .afterHTTPOptions !==
      "function"
  ) {

    throw new Error(
      "Sessao HTTP interna do SIGAA indisponivel."
    );

  }


  let requestUrl:
    URL;


  let method:
    "GET" |
    "POST";


  let body:
    string |
    undefined;


  let headers:
    Record<string, string> = {
      "User-Agent":
        "Cortex SIGAA Downloader/1.0",

      Accept:
        "*/*",

      "Cache-Control":
        "no-cache",
  };


  const form =
    file?.form;


  const id =
    safeText(
      file?.id,
      200
    );


  const key =
    safeText(
      file?.key,
      1000
    );


  if (
    form?.action?.href &&
    form?.postValues
  ) {

    requestUrl =
      httpSession.getURL(
        form.action.href
      );


    method =
      "POST";


    body =
      new URLSearchParams(
        Object.entries(
          form.postValues
        )
          .map(
            function (
              entry
            ) {

              return [
                String(
                  entry[0]
                ),
                String(
                  entry[1] ??
                  ""
                ),
              ];

            }
          )
      )
        .toString();


    headers[
      "Content-Type"
    ] =
      "application/x-www-form-urlencoded";


    headers[
      "Content-Length"
    ] =
      String(
        Buffer.byteLength(
          body
        )
      );

  }
  else if (
    id &&
    key
  ) {

    requestUrl =
      httpSession.getURL(
        "/sigaa/verFoto?idArquivo=" +
        encodeURIComponent(
          id
        ) +
        "&key=" +
        encodeURIComponent(
          key
        )
      );


    method =
      "GET";

  }
  else {

    throw new Error(
      "Arquivo SIGAA sem formulario ou chave valida."
    );

  }


  for (
    let redirectCount = 0;
    redirectCount < 6;
    redirectCount += 1
  ) {

    const requestOptions =
      await httpSession
        .afterHTTPOptions(
          requestUrl,
          {
            hostname:
              requestUrl.hostname,

            method,

            headers:
              {
                ...headers,
              },
          },
          body
        );


    const response =
      await withTimeout<Response>(
        fetch(
          requestUrl,
          {
            method,

            headers:
              requestOptions.headers,

            body:
              method ===
                "POST"
                ? body
                : undefined,

            redirect:
              "manual",
          }
        ),
        45000,
        "Timeout ao baixar arquivo diretamente do SIGAA."
      );


    if (
      response.status >= 300 &&
      response.status < 400
    ) {

      const location =
        response.headers
          .get(
            "location"
          );


      if (!location) {

        throw new Error(
          "SIGAA redirecionou o download sem informar destino."
        );

      }


      requestUrl =
        new URL(
          location,
          requestUrl
        );


      /*
       * O SIGAA costuma responder POST -> 302 -> GET
       * para entregar o binario.
       */
      method =
        "GET";


      body =
        undefined;


      delete headers[
        "Content-Type"
      ];


      delete headers[
        "Content-Length"
      ];


      continue;

    }


    if (
      response.status !== 200
    ) {

      throw new Error(
        "SIGAA retornou HTTP " +
        response.status +
        " no download."
      );

    }


    const contentType =
      String(
        response.headers
          .get(
            "content-type"
          ) ||
        ""
      )
        .toLowerCase();


    if (
      contentType.includes(
        "text/html"
      )
    ) {

      const preview =
        (
          await response
            .text()
        )
          .slice(
            0,
            500
          );


      throw new Error(
        "SIGAA retornou HTML em vez do arquivo: " +
        preview
          .replace(
            /\s+/g,
            " "
          )
          .slice(
            0,
            180
          )
      );

    }


    const disposition =
      response.headers
        .get(
          "content-disposition"
        ) ||
      "";


    let filename =
      safeText(
        file?.title ||
        "arquivo",
        180
      );


    const utf8Name =
      disposition
        .match(
          /filename\*=UTF-8''([^;]+)/i
        );


    const plainName =
      disposition
        .match(
          /filename="?([^";]+)"?/i
        );


    if (
      utf8Name?.[1]
    ) {

      try {

        filename =
          decodeURIComponent(
            utf8Name[1]
          );

      }
      catch {

        filename =
          utf8Name[1];

      }

    }
    else if (
      plainName?.[1]
    ) {

      filename =
        plainName[1];

    }


    filename =
      path.basename(
        filename
          .replace(
            /[\r\n]/g,
            "_"
          )
      );


    const finalPath =
      path.join(
        tempDirectory,
        filename ||
        "arquivo"
      );


    const buffer =
      Buffer.from(
        await response
          .arrayBuffer()
      );


    await import(
      "node:fs/promises"
    )
      .then(
        function (
          fs
        ) {

          return fs.writeFile(
            finalPath,
            buffer
          );

        }
      );


    return finalPath;

  }


  throw new Error(
    "SIGAA excedeu o limite de redirecionamentos no download."
  );

}


async function downloadResolvedSigaaFile(
  file:
    any,
  tempDirectory:
    string
) {

  /*
   * Importante: o Cortex so entrega arquivos que conseguiu
   * baixar diretamente pela sessao HTTP autenticada do SIGAA.
   *
   * O fallback file.download() da biblioteca foi removido
   * porque ele pode salvar respostas intermediarias/HTML com
   * o nome do arquivo, fazendo parecer um PDF/Word real quando
   * o conteudo nao corresponde ao material do SIGAA.
   */
  return directAuthenticatedSigaaDownload(
    file,
    tempDirectory
  );

}

async function resolveFreshLessonFile(
  session:
    SigaaSession,
  course:
    any,
  courseId:
    string,
  fileId:
    string,
  lessonId:
    string |
    null,
  expectedTitle:
    string |
    null
) {

  const lessons =
    await loadCourseLessons(
      session,
      course,
      courseId,
      true
    );


  const normalizedExpected =
    expectedTitle
      ? normalizeSigaaFileTitle(
          expectedTitle
        )
      : "";


  for (
    const lesson
    of lessons
  ) {

    const currentLessonId =
      safeText(
        lesson?.id,
        200
      );


    if (
      lessonId &&
      currentLessonId !==
        lessonId
    ) {
      continue;
    }


    const attachments =
      Array.isArray(
        lesson?.attachments
      )
        ? lesson.attachments
        : [];


    for (
      const item
      of attachments
    ) {

      if (
        !isDownloadableSigaaFile(
          item
        )
      ) {
        continue;
      }


      if (
        String(
          item?.id ||
          ""
        ) !==
        fileId
      ) {
        continue;
      }


      if (
        normalizedExpected &&
        normalizeSigaaFileTitle(
          item?.title
        ) !==
          normalizedExpected
      ) {
        continue;
      }


      return item;

    }

  }


  return null;

}


async function resolveFreshCourseFile(
  course:
    any,
  fileId:
    string,
  expectedTitle:
    string |
    null
) {

  const files =
    Array.from(
      await withTimeout(
        course.getFiles(),
        20000,
        "Timeout ao atualizar arquivo da disciplina."
      ) as any[]
    );


  const normalizedExpected =
    expectedTitle
      ? normalizeSigaaFileTitle(
          expectedTitle
        )
      : "";


  return files
    .filter(
      isDownloadableSigaaFile
    )
    .find(
      function (
        item:
          any
      ) {

        if (
          String(
            item?.id ||
            ""
          ) !==
          fileId
        ) {
          return false;
        }


        if (
          normalizedExpected &&
          normalizeSigaaFileTitle(
            item?.title
          ) !==
            normalizedExpected
        ) {
          return false;
        }


        return true;

      }
    ) ||
    null;

}

export async function downloadSigaaCourseFile(
  userId:
    number,
  courseId:
    string,
  fileId:
    string,
  options:
    {
      source?:
        "lesson" |
        "course" |
        null;

      lessonId?:
        string |
        null;

      expectedTitle?:
        string |
        null;
    } = {}
) {

  const session =
    sessions.get(
      userId
    );


  if (!session) {

    return {
      status:
        409,

      error:
        "Conecte sua conta do SIGAA primeiro.",
    };

  }


  let tempDirectory:
    string |
    null =
    null;


  try {

    const course =
      await findCourse(
        session,
        courseId
      );


    if (!course) {

      return {
        status:
          404,

        error:
          "Disciplina nao encontrada.",
      };

    }


    const source =
      options.source ||
      null;


    const lessonId =
      safeText(
        options.lessonId,
        200
      ) ||
      null;


    const expectedTitle =
      safeText(
        options.expectedTitle,
        500
      ) ||
      null;


    let file:
      any =
      null;


    if (
      source ===
      "lesson"
    ) {

      file =
        await resolveFreshLessonFile(
          session,
          course,
          courseId,
          fileId,
          lessonId,
          expectedTitle
        );

    }
    else if (
      source ===
      "course"
    ) {

      file =
        await resolveFreshCourseFile(
          course,
          fileId,
          expectedTitle
        );

    }
    else {

      /*
       * Compatibilidade com links antigos: primeiro procura
       * pelo titulo exato nas aulas e depois nos arquivos.
       */
      file =
        await resolveFreshLessonFile(
          session,
          course,
          courseId,
          fileId,
          lessonId,
          expectedTitle
        )
          .catch(
            function () {
              return null;
            }
          );


      if (!file) {

        file =
          await resolveFreshCourseFile(
            course,
            fileId,
            expectedTitle
          )
            .catch(
              function () {
                return null;
              }
            );

      }

    }

    if (!file) {

      return {
        status:
          404,

        error:
          "Arquivo nao encontrado nesta disciplina. Atualize a turma e tente novamente.",
      };

    }


    tempDirectory =
      await mkdtemp(
        path.join(
          os.tmpdir(),
          "cortex-sigaa-"
        )
      );


    let downloadedPath:
      string;


    try {

      downloadedPath =
        await downloadResolvedSigaaFile(
          file,
          tempDirectory
        );

    }
    catch (
      firstError
    ) {

      console.warn(
        "SIGAA file download first attempt:",
        firstError instanceof Error
          ? firstError.message
          : String(
              firstError
            )
      );


      /*
       * Formulario/chave do SIGAA pode expirar rapidamente.
       * Recarrega o topico da aula e tenta uma unica vez
       * com um objeto novo, sem acionar o retry quebrado
       * da biblioteca.
       */
      const refreshed =
        source ===
          "course"
          ? await resolveFreshCourseFile(
              course,
              fileId,
              expectedTitle
            )
          : await resolveFreshLessonFile(
              session,
              course,
              courseId,
              fileId,
              lessonId,
              expectedTitle
            );


      if (!refreshed) {
        throw firstError;
      }


      file =
        refreshed;


      downloadedPath =
        await downloadResolvedSigaaFile(
          file,
          tempDirectory
        );

    }


    const resolved =
      path.resolve(
        downloadedPath
      );


    const root =
      path.resolve(
        tempDirectory
      ) +
      path.sep;


    if (
      !resolved.startsWith(
        root
      )
    ) {

      throw new Error(
        "Caminho de arquivo invalido."
      );

    }


    const fileStat =
      await stat(
        resolved
      );


    if (
      fileStat.size >
      50 * 1024 * 1024
    ) {

      return {
        status:
          413,

        error:
          "O arquivo excede o limite de 50 MB do Cortex.",
      };

    }


    const buffer =
      await readFile(
        resolved
      );


    const filename =
      path.basename(
        resolved
      ) ||
      safeText(
        file.title ||
        "arquivo",
        180
      );


    if (
      !validarArquivoSigaaBaixado(
        buffer,
        filename
      )
    ) {

      console.warn(
        "SIGAA file rejected: conteudo nao corresponde a um arquivo real.",
        {
          courseId,
          fileId,
          filename,
          bytes:
            buffer.length,
        }
      );


      return {
        status:
          502,

        error:
          "O SIGAA nao entregou o arquivo real. Atualize a disciplina e tente novamente.",
      };

    }


    return {
      status:
        200,

      filename,

      contentType:
        contentTypeForFile(
          filename
        ),

      buffer,
    };

  }
  catch (
    error
  ) {

    console.error(
      "SIGAA file download:",
      error instanceof Error
        ? error.message
        : String(error)
    );


    return {
      status:
        502,

      error:
        "Nao foi possivel baixar este arquivo do SIGAA.",
    };

  }
  finally {

    if (
      tempDirectory
    ) {

      await rm(
        tempDirectory,
        {
          recursive:
            true,

          force:
            true,
        }
      ).catch(
        function () {
          // Limpeza temporaria nao deve afetar a resposta.
        }
      );

    }

  }

}


export async function connectSigaa(
  userId:
    number,
  body:
    any
) {

  const username =
    String(
      body?.username ||
      ""
    ).trim();


  const password =
    String(
      body?.password ||
      ""
    );


  if (
    !username ||
    !password
  ) {

    return {

      status:
        400,

      data: {

        error:
          "Informe usuario e senha do SIGAA.",

      },

    };

  }


  const oldSession =
    sessions.get(
      userId
    );


  if (oldSession) {

    await safeLogout(
      oldSession.account
    );


    sessions.delete(
      userId
    );

  }


  try {

    const sigaa =
      createSigaaClient();


    const account: any =
      await withTimeout<any>(
        sigaa.login(
          username,
          password
        ),
        30000,
        "Timeout ao conectar no SIGAA."
      );


    let name =
      "Conta SIGAA";


    try {

      const accountName =
        await withTimeout(
          account.getName(),
          8000,
          "Timeout ao obter nome."
        );


      if (accountName) {

        name =
          String(
            accountName
          );

      }

    }
    catch {

      // Nome e opcional.

    }


    sessions.set(
      userId,
      {

        account,

        name,

        connectedAt:
          Date.now(),

      }
    );


    return {

      status:
        200,

      data: {

        connected:
          true,

        name,

      },

    };

  }
  catch (
    error
  ) {

    console.error(
      "SIGAA connect:",
      error instanceof Error
        ? error.message
        : String(error)
    );


    return {

      status:
        401,

      data: {

        connected:
          false,

        error:
          publicError(
            error
          ),

      },

    };

  }

}


export function sigaaStatus(
  userId:
    number
) {

  const session =
    sessions.get(
      userId
    );


  return {

    status:
      200,

    data: {

      connected:
        Boolean(
          session
        ),

      name:
        session?.name ||
        null,

      connectedAt:
        session?.connectedAt ||
        null,

    },

  };

}


async function loadUpcomingPriorities(
  courseObjects:
    any[]
) {

  const priorities:
    SigaaPriority[] = [];


  const now =
    Date.now();


  const dayMs =
    24 *
    60 *
    60 *
    1000;


  const batches:
    any[][] = [];


  for (
    let index = 0;
    index < courseObjects.length;
    index += 4
  ) {

    batches.push(
      courseObjects.slice(
        index,
        index + 4
      )
    );

  }


  for (
    const batch
    of batches
  ) {

    await Promise.all(
      batch.map(
        async function (
          course:
            any
        ) {

          const courseId =
            String(
              course?.id ||
              ""
            );


          const courseName =
            safeText(
              course?.title ||
              "Disciplina",
              240
            );


          const addPriority =
            function (
              kind:
                "exam" |
                "homework",
              id:
                string,
              title:
                string,
              rawDate:
                any
            ) {

              const date =
                isoDate(
                  rawDate
                );


              if (!date) {
                return;
              }


              const time =
                new Date(
                  date
                )
                  .getTime();


              if (
                !Number.isFinite(
                  time
                )
              ) {
                return;
              }


              const daysLeft =
                Math.ceil(
                  (
                    time -
                    now
                  ) /
                  dayMs
                );


              if (
                daysLeft < 0 ||
                daysLeft > 7
              ) {
                return;
              }


              priorities.push({
                id:
                  id ||
                  kind +
                  ":" +
                  courseId +
                  ":" +
                  date,

                kind,

                title:
                  safeText(
                    title ||
                    (
                      kind ===
                        "exam"
                        ? "Avaliação"
                        : "Atividade"
                    ),
                    400
                  ),

                course:
                  courseName,

                courseId,

                date,

                daysLeft,

                urgency:
                  daysLeft <= 1
                    ? "critical"
                    : daysLeft <= 3
                      ? "high"
                      : "attention",
              });

            };


          const [
            examsResult,
            homeworksResult,
          ] =
            await Promise.allSettled([
              withTimeout(
                course.getExamCalendar(),
                9000,
                "Timeout ao carregar avaliacoes prioritarias."
              ),

              withTimeout(
                course.getHomeworks(),
                9000,
                "Timeout ao carregar tarefas prioritarias."
              ),
            ]);


          if (
            examsResult.status ===
            "fulfilled"
          ) {

            Array
              .from(
                examsResult.value as any[]
              )
              .slice(
                0,
                50
              )
              .forEach(
                function (
                  exam:
                    any,
                  index:
                    number
                ) {

                  addPriority(
                    "exam",
                    String(
                      exam?.id ||
                      "exam-" +
                      index
                    ),
                    safeText(
                      exam?.description ||
                      "Avaliação",
                      400
                    ),
                    exam?.date
                  );

                }
              );

          }


          if (
            homeworksResult.status ===
            "fulfilled"
          ) {

            Array
              .from(
                homeworksResult.value as any[]
              )
              .slice(
                0,
                80
              )
              .forEach(
                function (
                  homework:
                    any,
                  index:
                    number
                ) {

                  addPriority(
                    "homework",
                    String(
                      homework?.id ||
                      "homework-" +
                      index
                    ),
                    safeText(
                      homework?.title ||
                      "Atividade",
                      400
                    ),
                    homework?.endDate
                  );

                }
              );

          }

        }
      )
    );

  }


  priorities.sort(
    function (
      a,
      b
    ) {

      return (
        new Date(
          a.date
        ).getTime() -
        new Date(
          b.date
        ).getTime()
      );

    }
  );


  return priorities
    .slice(
      0,
      30
    );

}


async function loadRecentNoticesFast(
  courseObjects:
    any[]
) {

  const groups =
    await Promise.all(
      courseObjects
        .slice(
          0,
          10
        )
        .map(
          async function (
            course:
              any
          ) {

            try {

              const rawNotices =
                await withTimeout(
                  course.getNews(),
                  6500,
                  "Timeout ao carregar avisos."
                );


              const recentNotices =
                Array
                  .from(
                    rawNotices as any[]
                  )
                  .slice(
                    0,
                    3
                  );


              return await Promise.all(
                recentNotices.map(
                  function (
                    notice:
                      any
                  ) {

                    return readNotice(
                      notice,
                      course
                    );

                  }
                )
              );

            }
            catch {

              return [];

            }

          }
        )
    );


  const notices =
    groups.flat();


  notices.sort(
    function (
      a,
      b
    ) {

      const aTime =
        a.date
          ? new Date(
              a.date
            ).getTime()
          : 0;


      const bTime =
        b.date
          ? new Date(
              b.date
            ).getTime()
          : 0;


      return (
        bTime -
        aTime
      );

    }
  );


  return notices.slice(
    0,
    20
  );

}


function startOverviewEnrichment(
  session:
    SigaaSession,
  courseObjects:
    any[],
  baseOverview:
    SigaaOverview
) {

  if (
    session.enrichmentPromise
  ) {

    return;
  }


  session.enriching =
    true;


  session.enrichmentPromise =
    Promise.all([
      loadRecentNoticesFast(
        courseObjects
      ),
      loadUpcomingPriorities(
        courseObjects
      ),
    ])
      .then(
        function ([
          notices,
          priorities,
        ]) {

          const enriched:
            SigaaOverview = {

            ...baseOverview,

            notices,

            priorities,

            updatedAt:
              new Date()
                .toISOString(),

          };


          session.cache = {

            createdAt:
              Date.now(),

            value:
              enriched,

          };

        }
      )
      .catch(
        function (
          error
        ) {

          console.warn(
            "SIGAA background sync:",
            error instanceof Error
              ? error.message
              : String(
                  error
                )
          );

        }
      )
      .finally(
        function () {

          session.enriching =
            false;

          session.enrichmentPromise =
            undefined;

        }
      );

}


export async function sigaaOverview(
  userId:
    number,
  force:
    boolean
) {

  const session =
    sessions.get(
      userId
    );


  if (!session) {

    return {

      status:
        409,

      data: {

        connected:
          false,

        error:
          "Conecte sua conta do SIGAA primeiro.",

      },

    };

  }


  if (
    !force &&
    session.cache &&
    (
      Date.now() -
      session.cache.createdAt
    ) <
    CACHE_DURATION
  ) {

    return {

      status:
        200,

      data: {

        ...session.cache.value,

        cached:
          true,

        syncing:
          Boolean(
            session.enriching
          ),

      },

    };

  }


  try {

    const bonds =
      await withTimeout(
        session.account
          .getActiveBonds(),
        15000,
        "Timeout ao carregar vinculos."
      );


    const studentBond =
      Array
        .from(
          bonds as any[]
        )
        .find(
          function (
            bond:
              any
          ) {

            return (
              bond.type ===
              "student"
            );

          }
        ) as any;


    if (!studentBond) {

      return {

        status:
          404,

        data: {

          error:
            "Nenhum vinculo ativo de estudante foi encontrado.",

        },

      };

    }


    const [
      currentPeriod,
      rawCourses,
    ] =
      await Promise.all([
        withTimeout(
          studentBond
            .getCurrentPeriod(),
          9000,
          "Timeout ao carregar periodo."
        ),
        withTimeout(
          studentBond
            .getCourses(),
          12000,
          "Timeout ao carregar turmas."
        ),
      ]);


    const courseObjects =
      Array.from(
        rawCourses as any[]
      );


    session.courses =
      courseObjects;


    session.filesByCourse ??=
      new Map();


    session.detailCache ??=
      new Map();


    const courses:
      SigaaCourse[] =
      courseObjects.map(
        function (
          course:
            any
        ) {

          return {

            id:
              String(
                course.id ||
                ""
              ),

            name:
              String(
                course.title ||
                "Turma"
              ),

            code:
              String(
                course.code ||
                ""
              ),

            period:
              String(
                course.period ||
                ""
              ),

            schedule:
              String(
                course.schedule ||
                ""
              ),

          };

        }
      );


    const previous =
      session.cache?.value;


    const overview:
      SigaaOverview = {

      connected:
        true,

      student: {

        name:
          session.name,

        registration:
          String(
            studentBond.registration ||
            ""
          ),

        program:
          String(
            studentBond.program ||
            ""
          ),

        period:
          String(
            currentPeriod ||
            ""
          ),

      },

      courses,

      notices:
        previous?.notices ||
        [],

      priorities:
        previous?.priorities ||
        [],

      schedule:
        parseSchedule(
          courses
        ),

      updatedAt:
        new Date()
          .toISOString(),

    };


    session.cache = {

      createdAt:
        Date.now(),

      value:
        overview,

    };


    startOverviewEnrichment(
      session,
      courseObjects,
      overview
    );


    return {

      status:
        200,

      data: {

        ...overview,

        cached:
          false,

        syncing:
          true,

      },

    };

  }
  catch (
    error
  ) {

    console.error(
      "SIGAA overview:",
      error instanceof Error
        ? error.message
        : String(error)
    );


    return {

      status:
        502,

      data: {

        connected:
          true,

        error:
          publicError(
            error
          ),

      },

    };

  }

}


export async function disconnectSigaa(
  userId:
    number
) {

  const session =
    sessions.get(
      userId
    );


  if (session) {

    await safeLogout(
      session.account
    );


    sessions.delete(
      userId
    );

  }


  return {

    status:
      200,

    data: {

      connected:
        false,

      success:
        true,

    },

  };

}