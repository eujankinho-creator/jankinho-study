import {
  createRequire,
} from "node:module";


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