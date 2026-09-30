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

  let date:
    string |
    null =
    null;


  let content =
    "";


  try {

    const rawDate =
      await withTimeout<any>(
        notice.getDate(),
        6000,
        "Timeout em aviso."
      );


    const parsed =
      new Date(
        rawDate
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
  catch {

    // Avisos sem data continuam validos.

  }


  try {

    const rawContent =
      await withTimeout(
        notice.getContent(),
        6000,
        "Timeout no conteudo."
      );


    content =
      String(
        rawContent ||
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
        );

  }
  catch {

    // Conteudo detalhado pode nao estar disponivel.

  }


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


    const grades =
      await safeCourseSection(
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
      );


    const absences =
      await safeCourseSection(
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
      );


    const files =
      await safeCourseSection(
        "arquivos",
        async function () {

          const rawFiles =
            Array.from(
              await course
                .getFiles() as any[]
            );


          session.filesByCourse ??=
            new Map();


          session.filesByCourse.set(
            courseId,
            rawFiles
          );


          return rawFiles
            .slice(
              0,
              100
            )
            .map(
              function (
                file:
                  any
              ) {

                return {
                  id:
                    String(
                      file.id ||
                      ""
                    ),

                  title:
                    safeText(
                      file.title ||
                      "Arquivo",
                      240
                    ),

                  description:
                    safeText(
                      file.description,
                      1000
                    ),
                };

              }
            );

        }
      );


    const exams =
      await safeCourseSection(
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
      );


    const homeworks =
      await safeCourseSection(
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
      );


    const lessons =
      await safeCourseSection(
        "aulas",
        async function () {

          const list =
            Array.from(
              await course
                .getLessons() as any[]
            );


          return list
            .slice(
              0,
              80
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
                      2500
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
                            30
                          )
                          .map(
                            function (
                              attachment:
                                any
                            ) {

                              return {
                                type:
                                  safeText(
                                    attachment.type ||
                                    "recurso",
                                    80
                                  ),

                                title:
                                  safeText(
                                    attachment.title ||
                                    attachment.name ||
                                    "Recurso",
                                    240
                                  ),
                              };

                            }
                          )
                      : [],
                };

              }
            );

        }
      );


    const syllabus =
      await safeCourseSection(
        "plano de ensino",
        async function () {

          return serializeSyllabus(
            await course
              .getSyllabus()
          );

        }
      );


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


export async function downloadSigaaCourseFile(
  userId:
    number,
  courseId:
    string,
  fileId:
    string
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


    session.filesByCourse ??=
      new Map();


    let files =
      session.filesByCourse.get(
        courseId
      );


    if (!files) {

      files =
        Array.from(
          await withTimeout(
            course.getFiles(),
            15000,
            "Timeout ao carregar arquivos."
          ) as any[]
        );


      session.filesByCourse.set(
        courseId,
        files
      );

    }


    const file =
      files.find(
        function (
          item:
            any
        ) {

          return (
            String(
              item.id ||
              ""
            ) ===
            fileId
          );

        }
      );


    if (!file) {

      return {
        status:
          404,

        error:
          "Arquivo nao encontrado nesta disciplina.",
      };

    }


    tempDirectory =
      await mkdtemp(
        path.join(
          os.tmpdir(),
          "cortex-sigaa-"
        )
      );


    const downloadedPath =
      await withTimeout<string>(
        file.download(
          tempDirectory
        ) as Promise<string>,
        45000,
        "Timeout ao baixar arquivo."
      );


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


    const currentPeriod =
      await withTimeout(
        studentBond
          .getCurrentPeriod(),
        12000,
        "Timeout ao carregar periodo."
      );


    const rawCourses =
      await withTimeout(
        studentBond
          .getCourses(),
        18000,
        "Timeout ao carregar turmas."
      );


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


    const notices:
      SigaaNotice[] = [];


    /*
     * Limitamos a leitura inicial para
     * evitar excesso de requisicoes no SIGAA.
     */

    for (
      const course
      of courseObjects.slice(
        0,
        10
      )
    ) {

      try {

        const rawNotices =
          await withTimeout(
            course.getNews(),
            10000,
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


        for (
          const notice
          of recentNotices
        ) {

          notices.push(
            await readNotice(
              notice,
              course
            )
          );

        }

      }
      catch (
        error
      ) {

        console.warn(
          "SIGAA news:",
          String(
            course?.title ||
            "turma"
          )
        );

      }

    }


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
        notices.slice(
          0,
          20
        ),

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


    return {

      status:
        200,

      data: {

        ...overview,

        cached:
          false,

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