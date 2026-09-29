
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Disciplina
 * 
 */
export type Disciplina = $Result.DefaultSelection<Prisma.$DisciplinaPayload>
/**
 * Model Questao
 * 
 */
export type Questao = $Result.DefaultSelection<Prisma.$QuestaoPayload>
/**
 * Model Alternativa
 * 
 */
export type Alternativa = $Result.DefaultSelection<Prisma.$AlternativaPayload>
/**
 * Model Resposta
 * 
 */
export type Resposta = $Result.DefaultSelection<Prisma.$RespostaPayload>
/**
 * Model Flashcard
 * 
 */
export type Flashcard = $Result.DefaultSelection<Prisma.$FlashcardPayload>
/**
 * Model Movimentacao
 * 
 */
export type Movimentacao = $Result.DefaultSelection<Prisma.$MovimentacaoPayload>
/**
 * Model CasoClinico
 * 
 */
export type CasoClinico = $Result.DefaultSelection<Prisma.$CasoClinicoPayload>
/**
 * Model ExameCaso
 * 
 */
export type ExameCaso = $Result.DefaultSelection<Prisma.$ExameCasoPayload>
/**
 * Model InvestigacaoCaso
 * 
 */
export type InvestigacaoCaso = $Result.DefaultSelection<Prisma.$InvestigacaoCasoPayload>
/**
 * Model RegistroInvestigacao
 * 
 */
export type RegistroInvestigacao = $Result.DefaultSelection<Prisma.$RegistroInvestigacaoPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoMovimentacao: {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA'
};

export type TipoMovimentacao = (typeof TipoMovimentacao)[keyof typeof TipoMovimentacao]

}

export type TipoMovimentacao = $Enums.TipoMovimentacao

export const TipoMovimentacao: typeof $Enums.TipoMovimentacao

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.disciplina`: Exposes CRUD operations for the **Disciplina** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Disciplinas
    * const disciplinas = await prisma.disciplina.findMany()
    * ```
    */
  get disciplina(): Prisma.DisciplinaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questao`: Exposes CRUD operations for the **Questao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questaos
    * const questaos = await prisma.questao.findMany()
    * ```
    */
  get questao(): Prisma.QuestaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alternativa`: Exposes CRUD operations for the **Alternativa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alternativas
    * const alternativas = await prisma.alternativa.findMany()
    * ```
    */
  get alternativa(): Prisma.AlternativaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resposta`: Exposes CRUD operations for the **Resposta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Respostas
    * const respostas = await prisma.resposta.findMany()
    * ```
    */
  get resposta(): Prisma.RespostaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flashcard`: Exposes CRUD operations for the **Flashcard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flashcards
    * const flashcards = await prisma.flashcard.findMany()
    * ```
    */
  get flashcard(): Prisma.FlashcardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.movimentacao`: Exposes CRUD operations for the **Movimentacao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Movimentacaos
    * const movimentacaos = await prisma.movimentacao.findMany()
    * ```
    */
  get movimentacao(): Prisma.MovimentacaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.casoClinico`: Exposes CRUD operations for the **CasoClinico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CasoClinicos
    * const casoClinicos = await prisma.casoClinico.findMany()
    * ```
    */
  get casoClinico(): Prisma.CasoClinicoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exameCaso`: Exposes CRUD operations for the **ExameCaso** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExameCasos
    * const exameCasos = await prisma.exameCaso.findMany()
    * ```
    */
  get exameCaso(): Prisma.ExameCasoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.investigacaoCaso`: Exposes CRUD operations for the **InvestigacaoCaso** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvestigacaoCasos
    * const investigacaoCasos = await prisma.investigacaoCaso.findMany()
    * ```
    */
  get investigacaoCaso(): Prisma.InvestigacaoCasoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.registroInvestigacao`: Exposes CRUD operations for the **RegistroInvestigacao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RegistroInvestigacaos
    * const registroInvestigacaos = await prisma.registroInvestigacao.findMany()
    * ```
    */
  get registroInvestigacao(): Prisma.RegistroInvestigacaoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Disciplina: 'Disciplina',
    Questao: 'Questao',
    Alternativa: 'Alternativa',
    Resposta: 'Resposta',
    Flashcard: 'Flashcard',
    Movimentacao: 'Movimentacao',
    CasoClinico: 'CasoClinico',
    ExameCaso: 'ExameCaso',
    InvestigacaoCaso: 'InvestigacaoCaso',
    RegistroInvestigacao: 'RegistroInvestigacao'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "usuario" | "disciplina" | "questao" | "alternativa" | "resposta" | "flashcard" | "movimentacao" | "casoClinico" | "exameCaso" | "investigacaoCaso" | "registroInvestigacao"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Disciplina: {
        payload: Prisma.$DisciplinaPayload<ExtArgs>
        fields: Prisma.DisciplinaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DisciplinaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DisciplinaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          findFirst: {
            args: Prisma.DisciplinaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DisciplinaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          findMany: {
            args: Prisma.DisciplinaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>[]
          }
          create: {
            args: Prisma.DisciplinaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          createMany: {
            args: Prisma.DisciplinaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DisciplinaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>[]
          }
          delete: {
            args: Prisma.DisciplinaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          update: {
            args: Prisma.DisciplinaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          deleteMany: {
            args: Prisma.DisciplinaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DisciplinaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DisciplinaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>[]
          }
          upsert: {
            args: Prisma.DisciplinaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinaPayload>
          }
          aggregate: {
            args: Prisma.DisciplinaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDisciplina>
          }
          groupBy: {
            args: Prisma.DisciplinaGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisciplinaGroupByOutputType>[]
          }
          count: {
            args: Prisma.DisciplinaCountArgs<ExtArgs>
            result: $Utils.Optional<DisciplinaCountAggregateOutputType> | number
          }
        }
      }
      Questao: {
        payload: Prisma.$QuestaoPayload<ExtArgs>
        fields: Prisma.QuestaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          findFirst: {
            args: Prisma.QuestaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          findMany: {
            args: Prisma.QuestaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>[]
          }
          create: {
            args: Prisma.QuestaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          createMany: {
            args: Prisma.QuestaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>[]
          }
          delete: {
            args: Prisma.QuestaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          update: {
            args: Prisma.QuestaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          deleteMany: {
            args: Prisma.QuestaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>[]
          }
          upsert: {
            args: Prisma.QuestaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestaoPayload>
          }
          aggregate: {
            args: Prisma.QuestaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestao>
          }
          groupBy: {
            args: Prisma.QuestaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestaoCountArgs<ExtArgs>
            result: $Utils.Optional<QuestaoCountAggregateOutputType> | number
          }
        }
      }
      Alternativa: {
        payload: Prisma.$AlternativaPayload<ExtArgs>
        fields: Prisma.AlternativaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlternativaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlternativaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          findFirst: {
            args: Prisma.AlternativaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlternativaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          findMany: {
            args: Prisma.AlternativaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>[]
          }
          create: {
            args: Prisma.AlternativaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          createMany: {
            args: Prisma.AlternativaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlternativaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>[]
          }
          delete: {
            args: Prisma.AlternativaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          update: {
            args: Prisma.AlternativaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          deleteMany: {
            args: Prisma.AlternativaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlternativaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlternativaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>[]
          }
          upsert: {
            args: Prisma.AlternativaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlternativaPayload>
          }
          aggregate: {
            args: Prisma.AlternativaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlternativa>
          }
          groupBy: {
            args: Prisma.AlternativaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlternativaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlternativaCountArgs<ExtArgs>
            result: $Utils.Optional<AlternativaCountAggregateOutputType> | number
          }
        }
      }
      Resposta: {
        payload: Prisma.$RespostaPayload<ExtArgs>
        fields: Prisma.RespostaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RespostaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RespostaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findFirst: {
            args: Prisma.RespostaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RespostaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findMany: {
            args: Prisma.RespostaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          create: {
            args: Prisma.RespostaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          createMany: {
            args: Prisma.RespostaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RespostaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          delete: {
            args: Prisma.RespostaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          update: {
            args: Prisma.RespostaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          deleteMany: {
            args: Prisma.RespostaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RespostaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RespostaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          upsert: {
            args: Prisma.RespostaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          aggregate: {
            args: Prisma.RespostaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResposta>
          }
          groupBy: {
            args: Prisma.RespostaGroupByArgs<ExtArgs>
            result: $Utils.Optional<RespostaGroupByOutputType>[]
          }
          count: {
            args: Prisma.RespostaCountArgs<ExtArgs>
            result: $Utils.Optional<RespostaCountAggregateOutputType> | number
          }
        }
      }
      Flashcard: {
        payload: Prisma.$FlashcardPayload<ExtArgs>
        fields: Prisma.FlashcardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findFirst: {
            args: Prisma.FlashcardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findMany: {
            args: Prisma.FlashcardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          create: {
            args: Prisma.FlashcardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          createMany: {
            args: Prisma.FlashcardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          delete: {
            args: Prisma.FlashcardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          update: {
            args: Prisma.FlashcardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlashcardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          upsert: {
            args: Prisma.FlashcardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          aggregate: {
            args: Prisma.FlashcardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcard>
          }
          groupBy: {
            args: Prisma.FlashcardGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardCountAggregateOutputType> | number
          }
        }
      }
      Movimentacao: {
        payload: Prisma.$MovimentacaoPayload<ExtArgs>
        fields: Prisma.MovimentacaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovimentacaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovimentacaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          findFirst: {
            args: Prisma.MovimentacaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovimentacaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          findMany: {
            args: Prisma.MovimentacaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>[]
          }
          create: {
            args: Prisma.MovimentacaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          createMany: {
            args: Prisma.MovimentacaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovimentacaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>[]
          }
          delete: {
            args: Prisma.MovimentacaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          update: {
            args: Prisma.MovimentacaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          deleteMany: {
            args: Prisma.MovimentacaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovimentacaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MovimentacaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>[]
          }
          upsert: {
            args: Prisma.MovimentacaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          aggregate: {
            args: Prisma.MovimentacaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovimentacao>
          }
          groupBy: {
            args: Prisma.MovimentacaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovimentacaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovimentacaoCountArgs<ExtArgs>
            result: $Utils.Optional<MovimentacaoCountAggregateOutputType> | number
          }
        }
      }
      CasoClinico: {
        payload: Prisma.$CasoClinicoPayload<ExtArgs>
        fields: Prisma.CasoClinicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CasoClinicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CasoClinicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          findFirst: {
            args: Prisma.CasoClinicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CasoClinicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          findMany: {
            args: Prisma.CasoClinicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>[]
          }
          create: {
            args: Prisma.CasoClinicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          createMany: {
            args: Prisma.CasoClinicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CasoClinicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>[]
          }
          delete: {
            args: Prisma.CasoClinicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          update: {
            args: Prisma.CasoClinicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          deleteMany: {
            args: Prisma.CasoClinicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CasoClinicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CasoClinicoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>[]
          }
          upsert: {
            args: Prisma.CasoClinicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasoClinicoPayload>
          }
          aggregate: {
            args: Prisma.CasoClinicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCasoClinico>
          }
          groupBy: {
            args: Prisma.CasoClinicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<CasoClinicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.CasoClinicoCountArgs<ExtArgs>
            result: $Utils.Optional<CasoClinicoCountAggregateOutputType> | number
          }
        }
      }
      ExameCaso: {
        payload: Prisma.$ExameCasoPayload<ExtArgs>
        fields: Prisma.ExameCasoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExameCasoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExameCasoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          findFirst: {
            args: Prisma.ExameCasoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExameCasoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          findMany: {
            args: Prisma.ExameCasoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>[]
          }
          create: {
            args: Prisma.ExameCasoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          createMany: {
            args: Prisma.ExameCasoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExameCasoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>[]
          }
          delete: {
            args: Prisma.ExameCasoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          update: {
            args: Prisma.ExameCasoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          deleteMany: {
            args: Prisma.ExameCasoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExameCasoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExameCasoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>[]
          }
          upsert: {
            args: Prisma.ExameCasoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExameCasoPayload>
          }
          aggregate: {
            args: Prisma.ExameCasoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExameCaso>
          }
          groupBy: {
            args: Prisma.ExameCasoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExameCasoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExameCasoCountArgs<ExtArgs>
            result: $Utils.Optional<ExameCasoCountAggregateOutputType> | number
          }
        }
      }
      InvestigacaoCaso: {
        payload: Prisma.$InvestigacaoCasoPayload<ExtArgs>
        fields: Prisma.InvestigacaoCasoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvestigacaoCasoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvestigacaoCasoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          findFirst: {
            args: Prisma.InvestigacaoCasoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvestigacaoCasoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          findMany: {
            args: Prisma.InvestigacaoCasoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>[]
          }
          create: {
            args: Prisma.InvestigacaoCasoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          createMany: {
            args: Prisma.InvestigacaoCasoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvestigacaoCasoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>[]
          }
          delete: {
            args: Prisma.InvestigacaoCasoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          update: {
            args: Prisma.InvestigacaoCasoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          deleteMany: {
            args: Prisma.InvestigacaoCasoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvestigacaoCasoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvestigacaoCasoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>[]
          }
          upsert: {
            args: Prisma.InvestigacaoCasoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvestigacaoCasoPayload>
          }
          aggregate: {
            args: Prisma.InvestigacaoCasoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvestigacaoCaso>
          }
          groupBy: {
            args: Prisma.InvestigacaoCasoGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvestigacaoCasoGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvestigacaoCasoCountArgs<ExtArgs>
            result: $Utils.Optional<InvestigacaoCasoCountAggregateOutputType> | number
          }
        }
      }
      RegistroInvestigacao: {
        payload: Prisma.$RegistroInvestigacaoPayload<ExtArgs>
        fields: Prisma.RegistroInvestigacaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegistroInvestigacaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegistroInvestigacaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          findFirst: {
            args: Prisma.RegistroInvestigacaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegistroInvestigacaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          findMany: {
            args: Prisma.RegistroInvestigacaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>[]
          }
          create: {
            args: Prisma.RegistroInvestigacaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          createMany: {
            args: Prisma.RegistroInvestigacaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RegistroInvestigacaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>[]
          }
          delete: {
            args: Prisma.RegistroInvestigacaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          update: {
            args: Prisma.RegistroInvestigacaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          deleteMany: {
            args: Prisma.RegistroInvestigacaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegistroInvestigacaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RegistroInvestigacaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>[]
          }
          upsert: {
            args: Prisma.RegistroInvestigacaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistroInvestigacaoPayload>
          }
          aggregate: {
            args: Prisma.RegistroInvestigacaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegistroInvestigacao>
          }
          groupBy: {
            args: Prisma.RegistroInvestigacaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegistroInvestigacaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegistroInvestigacaoCountArgs<ExtArgs>
            result: $Utils.Optional<RegistroInvestigacaoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit
    disciplina?: DisciplinaOmit
    questao?: QuestaoOmit
    alternativa?: AlternativaOmit
    resposta?: RespostaOmit
    flashcard?: FlashcardOmit
    movimentacao?: MovimentacaoOmit
    casoClinico?: CasoClinicoOmit
    exameCaso?: ExameCasoOmit
    investigacaoCaso?: InvestigacaoCasoOmit
    registroInvestigacao?: RegistroInvestigacaoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    disciplinas: number
    questoes: number
    respostas: number
    flashcards: number
    movimentacoes: number
    casosCriados: number
    investigacoes: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    disciplinas?: boolean | UsuarioCountOutputTypeCountDisciplinasArgs
    questoes?: boolean | UsuarioCountOutputTypeCountQuestoesArgs
    respostas?: boolean | UsuarioCountOutputTypeCountRespostasArgs
    flashcards?: boolean | UsuarioCountOutputTypeCountFlashcardsArgs
    movimentacoes?: boolean | UsuarioCountOutputTypeCountMovimentacoesArgs
    casosCriados?: boolean | UsuarioCountOutputTypeCountCasosCriadosArgs
    investigacoes?: boolean | UsuarioCountOutputTypeCountInvestigacoesArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountDisciplinasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisciplinaWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountQuestoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestaoWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountFlashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountMovimentacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimentacaoWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountCasosCriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CasoClinicoWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountInvestigacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigacaoCasoWhereInput
  }


  /**
   * Count Type DisciplinaCountOutputType
   */

  export type DisciplinaCountOutputType = {
    questoes: number
  }

  export type DisciplinaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questoes?: boolean | DisciplinaCountOutputTypeCountQuestoesArgs
  }

  // Custom InputTypes
  /**
   * DisciplinaCountOutputType without action
   */
  export type DisciplinaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplinaCountOutputType
     */
    select?: DisciplinaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DisciplinaCountOutputType without action
   */
  export type DisciplinaCountOutputTypeCountQuestoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestaoWhereInput
  }


  /**
   * Count Type QuestaoCountOutputType
   */

  export type QuestaoCountOutputType = {
    alternativas: number
    respostas: number
  }

  export type QuestaoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alternativas?: boolean | QuestaoCountOutputTypeCountAlternativasArgs
    respostas?: boolean | QuestaoCountOutputTypeCountRespostasArgs
  }

  // Custom InputTypes
  /**
   * QuestaoCountOutputType without action
   */
  export type QuestaoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestaoCountOutputType
     */
    select?: QuestaoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestaoCountOutputType without action
   */
  export type QuestaoCountOutputTypeCountAlternativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlternativaWhereInput
  }

  /**
   * QuestaoCountOutputType without action
   */
  export type QuestaoCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }


  /**
   * Count Type CasoClinicoCountOutputType
   */

  export type CasoClinicoCountOutputType = {
    investigacoes: number
    examesCaso: number
  }

  export type CasoClinicoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigacoes?: boolean | CasoClinicoCountOutputTypeCountInvestigacoesArgs
    examesCaso?: boolean | CasoClinicoCountOutputTypeCountExamesCasoArgs
  }

  // Custom InputTypes
  /**
   * CasoClinicoCountOutputType without action
   */
  export type CasoClinicoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinicoCountOutputType
     */
    select?: CasoClinicoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CasoClinicoCountOutputType without action
   */
  export type CasoClinicoCountOutputTypeCountInvestigacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigacaoCasoWhereInput
  }

  /**
   * CasoClinicoCountOutputType without action
   */
  export type CasoClinicoCountOutputTypeCountExamesCasoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExameCasoWhereInput
  }


  /**
   * Count Type InvestigacaoCasoCountOutputType
   */

  export type InvestigacaoCasoCountOutputType = {
    registros: number
  }

  export type InvestigacaoCasoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    registros?: boolean | InvestigacaoCasoCountOutputTypeCountRegistrosArgs
  }

  // Custom InputTypes
  /**
   * InvestigacaoCasoCountOutputType without action
   */
  export type InvestigacaoCasoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCasoCountOutputType
     */
    select?: InvestigacaoCasoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvestigacaoCasoCountOutputType without action
   */
  export type InvestigacaoCasoCountOutputTypeCountRegistrosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistroInvestigacaoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senhaHash: string | null
    createdAt: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senhaHash: string | null
    createdAt: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    senhaHash: number
    createdAt: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    nome: string
    email: string
    senhaHash: string | null
    createdAt: Date
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
    disciplinas?: boolean | Usuario$disciplinasArgs<ExtArgs>
    questoes?: boolean | Usuario$questoesArgs<ExtArgs>
    respostas?: boolean | Usuario$respostasArgs<ExtArgs>
    flashcards?: boolean | Usuario$flashcardsArgs<ExtArgs>
    movimentacoes?: boolean | Usuario$movimentacoesArgs<ExtArgs>
    casosCriados?: boolean | Usuario$casosCriadosArgs<ExtArgs>
    investigacoes?: boolean | Usuario$investigacoesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "senhaHash" | "createdAt", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    disciplinas?: boolean | Usuario$disciplinasArgs<ExtArgs>
    questoes?: boolean | Usuario$questoesArgs<ExtArgs>
    respostas?: boolean | Usuario$respostasArgs<ExtArgs>
    flashcards?: boolean | Usuario$flashcardsArgs<ExtArgs>
    movimentacoes?: boolean | Usuario$movimentacoesArgs<ExtArgs>
    casosCriados?: boolean | Usuario$casosCriadosArgs<ExtArgs>
    investigacoes?: boolean | Usuario$investigacoesArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      disciplinas: Prisma.$DisciplinaPayload<ExtArgs>[]
      questoes: Prisma.$QuestaoPayload<ExtArgs>[]
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
      flashcards: Prisma.$FlashcardPayload<ExtArgs>[]
      movimentacoes: Prisma.$MovimentacaoPayload<ExtArgs>[]
      casosCriados: Prisma.$CasoClinicoPayload<ExtArgs>[]
      investigacoes: Prisma.$InvestigacaoCasoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      email: string
      senhaHash: string | null
      createdAt: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    disciplinas<T extends Usuario$disciplinasArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$disciplinasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    questoes<T extends Usuario$questoesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$questoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    respostas<T extends Usuario$respostasArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    flashcards<T extends Usuario$flashcardsArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$flashcardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    movimentacoes<T extends Usuario$movimentacoesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$movimentacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    casosCriados<T extends Usuario$casosCriadosArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$casosCriadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    investigacoes<T extends Usuario$investigacoesArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$investigacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly nome: FieldRef<"Usuario", 'String'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly senhaHash: FieldRef<"Usuario", 'String'>
    readonly createdAt: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.disciplinas
   */
  export type Usuario$disciplinasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    where?: DisciplinaWhereInput
    orderBy?: DisciplinaOrderByWithRelationInput | DisciplinaOrderByWithRelationInput[]
    cursor?: DisciplinaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DisciplinaScalarFieldEnum | DisciplinaScalarFieldEnum[]
  }

  /**
   * Usuario.questoes
   */
  export type Usuario$questoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    where?: QuestaoWhereInput
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    cursor?: QuestaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestaoScalarFieldEnum | QuestaoScalarFieldEnum[]
  }

  /**
   * Usuario.respostas
   */
  export type Usuario$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Usuario.flashcards
   */
  export type Usuario$flashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    cursor?: FlashcardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Usuario.movimentacoes
   */
  export type Usuario$movimentacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    where?: MovimentacaoWhereInput
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    cursor?: MovimentacaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Usuario.casosCriados
   */
  export type Usuario$casosCriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    where?: CasoClinicoWhereInput
    orderBy?: CasoClinicoOrderByWithRelationInput | CasoClinicoOrderByWithRelationInput[]
    cursor?: CasoClinicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CasoClinicoScalarFieldEnum | CasoClinicoScalarFieldEnum[]
  }

  /**
   * Usuario.investigacoes
   */
  export type Usuario$investigacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    where?: InvestigacaoCasoWhereInput
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    cursor?: InvestigacaoCasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvestigacaoCasoScalarFieldEnum | InvestigacaoCasoScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Disciplina
   */

  export type AggregateDisciplina = {
    _count: DisciplinaCountAggregateOutputType | null
    _avg: DisciplinaAvgAggregateOutputType | null
    _sum: DisciplinaSumAggregateOutputType | null
    _min: DisciplinaMinAggregateOutputType | null
    _max: DisciplinaMaxAggregateOutputType | null
  }

  export type DisciplinaAvgAggregateOutputType = {
    id: number | null
    usuarioId: number | null
  }

  export type DisciplinaSumAggregateOutputType = {
    id: number | null
    usuarioId: number | null
  }

  export type DisciplinaMinAggregateOutputType = {
    id: number | null
    nome: string | null
    createdAt: Date | null
    usuarioId: number | null
  }

  export type DisciplinaMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    createdAt: Date | null
    usuarioId: number | null
  }

  export type DisciplinaCountAggregateOutputType = {
    id: number
    nome: number
    createdAt: number
    usuarioId: number
    _all: number
  }


  export type DisciplinaAvgAggregateInputType = {
    id?: true
    usuarioId?: true
  }

  export type DisciplinaSumAggregateInputType = {
    id?: true
    usuarioId?: true
  }

  export type DisciplinaMinAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
    usuarioId?: true
  }

  export type DisciplinaMaxAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
    usuarioId?: true
  }

  export type DisciplinaCountAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
    usuarioId?: true
    _all?: true
  }

  export type DisciplinaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disciplina to aggregate.
     */
    where?: DisciplinaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplinas to fetch.
     */
    orderBy?: DisciplinaOrderByWithRelationInput | DisciplinaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DisciplinaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplinas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplinas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Disciplinas
    **/
    _count?: true | DisciplinaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DisciplinaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DisciplinaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisciplinaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisciplinaMaxAggregateInputType
  }

  export type GetDisciplinaAggregateType<T extends DisciplinaAggregateArgs> = {
        [P in keyof T & keyof AggregateDisciplina]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDisciplina[P]>
      : GetScalarType<T[P], AggregateDisciplina[P]>
  }




  export type DisciplinaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisciplinaWhereInput
    orderBy?: DisciplinaOrderByWithAggregationInput | DisciplinaOrderByWithAggregationInput[]
    by: DisciplinaScalarFieldEnum[] | DisciplinaScalarFieldEnum
    having?: DisciplinaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisciplinaCountAggregateInputType | true
    _avg?: DisciplinaAvgAggregateInputType
    _sum?: DisciplinaSumAggregateInputType
    _min?: DisciplinaMinAggregateInputType
    _max?: DisciplinaMaxAggregateInputType
  }

  export type DisciplinaGroupByOutputType = {
    id: number
    nome: string
    createdAt: Date
    usuarioId: number
    _count: DisciplinaCountAggregateOutputType | null
    _avg: DisciplinaAvgAggregateOutputType | null
    _sum: DisciplinaSumAggregateOutputType | null
    _min: DisciplinaMinAggregateOutputType | null
    _max: DisciplinaMaxAggregateOutputType | null
  }

  type GetDisciplinaGroupByPayload<T extends DisciplinaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisciplinaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisciplinaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisciplinaGroupByOutputType[P]>
            : GetScalarType<T[P], DisciplinaGroupByOutputType[P]>
        }
      >
    >


  export type DisciplinaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questoes?: boolean | Disciplina$questoesArgs<ExtArgs>
    _count?: boolean | DisciplinaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disciplina"]>

  export type DisciplinaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disciplina"]>

  export type DisciplinaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disciplina"]>

  export type DisciplinaSelectScalar = {
    id?: boolean
    nome?: boolean
    createdAt?: boolean
    usuarioId?: boolean
  }

  export type DisciplinaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "createdAt" | "usuarioId", ExtArgs["result"]["disciplina"]>
  export type DisciplinaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questoes?: boolean | Disciplina$questoesArgs<ExtArgs>
    _count?: boolean | DisciplinaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DisciplinaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type DisciplinaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $DisciplinaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Disciplina"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      questoes: Prisma.$QuestaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      createdAt: Date
      usuarioId: number
    }, ExtArgs["result"]["disciplina"]>
    composites: {}
  }

  type DisciplinaGetPayload<S extends boolean | null | undefined | DisciplinaDefaultArgs> = $Result.GetResult<Prisma.$DisciplinaPayload, S>

  type DisciplinaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DisciplinaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DisciplinaCountAggregateInputType | true
    }

  export interface DisciplinaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Disciplina'], meta: { name: 'Disciplina' } }
    /**
     * Find zero or one Disciplina that matches the filter.
     * @param {DisciplinaFindUniqueArgs} args - Arguments to find a Disciplina
     * @example
     * // Get one Disciplina
     * const disciplina = await prisma.disciplina.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DisciplinaFindUniqueArgs>(args: SelectSubset<T, DisciplinaFindUniqueArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Disciplina that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DisciplinaFindUniqueOrThrowArgs} args - Arguments to find a Disciplina
     * @example
     * // Get one Disciplina
     * const disciplina = await prisma.disciplina.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DisciplinaFindUniqueOrThrowArgs>(args: SelectSubset<T, DisciplinaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disciplina that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaFindFirstArgs} args - Arguments to find a Disciplina
     * @example
     * // Get one Disciplina
     * const disciplina = await prisma.disciplina.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DisciplinaFindFirstArgs>(args?: SelectSubset<T, DisciplinaFindFirstArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disciplina that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaFindFirstOrThrowArgs} args - Arguments to find a Disciplina
     * @example
     * // Get one Disciplina
     * const disciplina = await prisma.disciplina.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DisciplinaFindFirstOrThrowArgs>(args?: SelectSubset<T, DisciplinaFindFirstOrThrowArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Disciplinas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Disciplinas
     * const disciplinas = await prisma.disciplina.findMany()
     * 
     * // Get first 10 Disciplinas
     * const disciplinas = await prisma.disciplina.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const disciplinaWithIdOnly = await prisma.disciplina.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DisciplinaFindManyArgs>(args?: SelectSubset<T, DisciplinaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Disciplina.
     * @param {DisciplinaCreateArgs} args - Arguments to create a Disciplina.
     * @example
     * // Create one Disciplina
     * const Disciplina = await prisma.disciplina.create({
     *   data: {
     *     // ... data to create a Disciplina
     *   }
     * })
     * 
     */
    create<T extends DisciplinaCreateArgs>(args: SelectSubset<T, DisciplinaCreateArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Disciplinas.
     * @param {DisciplinaCreateManyArgs} args - Arguments to create many Disciplinas.
     * @example
     * // Create many Disciplinas
     * const disciplina = await prisma.disciplina.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DisciplinaCreateManyArgs>(args?: SelectSubset<T, DisciplinaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Disciplinas and returns the data saved in the database.
     * @param {DisciplinaCreateManyAndReturnArgs} args - Arguments to create many Disciplinas.
     * @example
     * // Create many Disciplinas
     * const disciplina = await prisma.disciplina.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Disciplinas and only return the `id`
     * const disciplinaWithIdOnly = await prisma.disciplina.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DisciplinaCreateManyAndReturnArgs>(args?: SelectSubset<T, DisciplinaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Disciplina.
     * @param {DisciplinaDeleteArgs} args - Arguments to delete one Disciplina.
     * @example
     * // Delete one Disciplina
     * const Disciplina = await prisma.disciplina.delete({
     *   where: {
     *     // ... filter to delete one Disciplina
     *   }
     * })
     * 
     */
    delete<T extends DisciplinaDeleteArgs>(args: SelectSubset<T, DisciplinaDeleteArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Disciplina.
     * @param {DisciplinaUpdateArgs} args - Arguments to update one Disciplina.
     * @example
     * // Update one Disciplina
     * const disciplina = await prisma.disciplina.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DisciplinaUpdateArgs>(args: SelectSubset<T, DisciplinaUpdateArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Disciplinas.
     * @param {DisciplinaDeleteManyArgs} args - Arguments to filter Disciplinas to delete.
     * @example
     * // Delete a few Disciplinas
     * const { count } = await prisma.disciplina.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DisciplinaDeleteManyArgs>(args?: SelectSubset<T, DisciplinaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disciplinas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Disciplinas
     * const disciplina = await prisma.disciplina.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DisciplinaUpdateManyArgs>(args: SelectSubset<T, DisciplinaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disciplinas and returns the data updated in the database.
     * @param {DisciplinaUpdateManyAndReturnArgs} args - Arguments to update many Disciplinas.
     * @example
     * // Update many Disciplinas
     * const disciplina = await prisma.disciplina.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Disciplinas and only return the `id`
     * const disciplinaWithIdOnly = await prisma.disciplina.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DisciplinaUpdateManyAndReturnArgs>(args: SelectSubset<T, DisciplinaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Disciplina.
     * @param {DisciplinaUpsertArgs} args - Arguments to update or create a Disciplina.
     * @example
     * // Update or create a Disciplina
     * const disciplina = await prisma.disciplina.upsert({
     *   create: {
     *     // ... data to create a Disciplina
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Disciplina we want to update
     *   }
     * })
     */
    upsert<T extends DisciplinaUpsertArgs>(args: SelectSubset<T, DisciplinaUpsertArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Disciplinas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaCountArgs} args - Arguments to filter Disciplinas to count.
     * @example
     * // Count the number of Disciplinas
     * const count = await prisma.disciplina.count({
     *   where: {
     *     // ... the filter for the Disciplinas we want to count
     *   }
     * })
    **/
    count<T extends DisciplinaCountArgs>(
      args?: Subset<T, DisciplinaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisciplinaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Disciplina.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DisciplinaAggregateArgs>(args: Subset<T, DisciplinaAggregateArgs>): Prisma.PrismaPromise<GetDisciplinaAggregateType<T>>

    /**
     * Group by Disciplina.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplinaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DisciplinaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DisciplinaGroupByArgs['orderBy'] }
        : { orderBy?: DisciplinaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DisciplinaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisciplinaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Disciplina model
   */
  readonly fields: DisciplinaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Disciplina.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DisciplinaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questoes<T extends Disciplina$questoesArgs<ExtArgs> = {}>(args?: Subset<T, Disciplina$questoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Disciplina model
   */
  interface DisciplinaFieldRefs {
    readonly id: FieldRef<"Disciplina", 'Int'>
    readonly nome: FieldRef<"Disciplina", 'String'>
    readonly createdAt: FieldRef<"Disciplina", 'DateTime'>
    readonly usuarioId: FieldRef<"Disciplina", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Disciplina findUnique
   */
  export type DisciplinaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter, which Disciplina to fetch.
     */
    where: DisciplinaWhereUniqueInput
  }

  /**
   * Disciplina findUniqueOrThrow
   */
  export type DisciplinaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter, which Disciplina to fetch.
     */
    where: DisciplinaWhereUniqueInput
  }

  /**
   * Disciplina findFirst
   */
  export type DisciplinaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter, which Disciplina to fetch.
     */
    where?: DisciplinaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplinas to fetch.
     */
    orderBy?: DisciplinaOrderByWithRelationInput | DisciplinaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disciplinas.
     */
    cursor?: DisciplinaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplinas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplinas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disciplinas.
     */
    distinct?: DisciplinaScalarFieldEnum | DisciplinaScalarFieldEnum[]
  }

  /**
   * Disciplina findFirstOrThrow
   */
  export type DisciplinaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter, which Disciplina to fetch.
     */
    where?: DisciplinaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplinas to fetch.
     */
    orderBy?: DisciplinaOrderByWithRelationInput | DisciplinaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disciplinas.
     */
    cursor?: DisciplinaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplinas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplinas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disciplinas.
     */
    distinct?: DisciplinaScalarFieldEnum | DisciplinaScalarFieldEnum[]
  }

  /**
   * Disciplina findMany
   */
  export type DisciplinaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter, which Disciplinas to fetch.
     */
    where?: DisciplinaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplinas to fetch.
     */
    orderBy?: DisciplinaOrderByWithRelationInput | DisciplinaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Disciplinas.
     */
    cursor?: DisciplinaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplinas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplinas.
     */
    skip?: number
    distinct?: DisciplinaScalarFieldEnum | DisciplinaScalarFieldEnum[]
  }

  /**
   * Disciplina create
   */
  export type DisciplinaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * The data needed to create a Disciplina.
     */
    data: XOR<DisciplinaCreateInput, DisciplinaUncheckedCreateInput>
  }

  /**
   * Disciplina createMany
   */
  export type DisciplinaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Disciplinas.
     */
    data: DisciplinaCreateManyInput | DisciplinaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Disciplina createManyAndReturn
   */
  export type DisciplinaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * The data used to create many Disciplinas.
     */
    data: DisciplinaCreateManyInput | DisciplinaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Disciplina update
   */
  export type DisciplinaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * The data needed to update a Disciplina.
     */
    data: XOR<DisciplinaUpdateInput, DisciplinaUncheckedUpdateInput>
    /**
     * Choose, which Disciplina to update.
     */
    where: DisciplinaWhereUniqueInput
  }

  /**
   * Disciplina updateMany
   */
  export type DisciplinaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Disciplinas.
     */
    data: XOR<DisciplinaUpdateManyMutationInput, DisciplinaUncheckedUpdateManyInput>
    /**
     * Filter which Disciplinas to update
     */
    where?: DisciplinaWhereInput
    /**
     * Limit how many Disciplinas to update.
     */
    limit?: number
  }

  /**
   * Disciplina updateManyAndReturn
   */
  export type DisciplinaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * The data used to update Disciplinas.
     */
    data: XOR<DisciplinaUpdateManyMutationInput, DisciplinaUncheckedUpdateManyInput>
    /**
     * Filter which Disciplinas to update
     */
    where?: DisciplinaWhereInput
    /**
     * Limit how many Disciplinas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Disciplina upsert
   */
  export type DisciplinaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * The filter to search for the Disciplina to update in case it exists.
     */
    where: DisciplinaWhereUniqueInput
    /**
     * In case the Disciplina found by the `where` argument doesn't exist, create a new Disciplina with this data.
     */
    create: XOR<DisciplinaCreateInput, DisciplinaUncheckedCreateInput>
    /**
     * In case the Disciplina was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DisciplinaUpdateInput, DisciplinaUncheckedUpdateInput>
  }

  /**
   * Disciplina delete
   */
  export type DisciplinaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
    /**
     * Filter which Disciplina to delete.
     */
    where: DisciplinaWhereUniqueInput
  }

  /**
   * Disciplina deleteMany
   */
  export type DisciplinaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disciplinas to delete
     */
    where?: DisciplinaWhereInput
    /**
     * Limit how many Disciplinas to delete.
     */
    limit?: number
  }

  /**
   * Disciplina.questoes
   */
  export type Disciplina$questoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    where?: QuestaoWhereInput
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    cursor?: QuestaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestaoScalarFieldEnum | QuestaoScalarFieldEnum[]
  }

  /**
   * Disciplina without action
   */
  export type DisciplinaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Disciplina
     */
    select?: DisciplinaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Disciplina
     */
    omit?: DisciplinaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplinaInclude<ExtArgs> | null
  }


  /**
   * Model Questao
   */

  export type AggregateQuestao = {
    _count: QuestaoCountAggregateOutputType | null
    _avg: QuestaoAvgAggregateOutputType | null
    _sum: QuestaoSumAggregateOutputType | null
    _min: QuestaoMinAggregateOutputType | null
    _max: QuestaoMaxAggregateOutputType | null
  }

  export type QuestaoAvgAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    disciplinaId: number | null
  }

  export type QuestaoSumAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    disciplinaId: number | null
  }

  export type QuestaoMinAggregateOutputType = {
    id: number | null
    enunciado: string | null
    explicacao: string | null
    tema: string | null
    dificuldade: string | null
    createdAt: Date | null
    usuarioId: number | null
    disciplinaId: number | null
  }

  export type QuestaoMaxAggregateOutputType = {
    id: number | null
    enunciado: string | null
    explicacao: string | null
    tema: string | null
    dificuldade: string | null
    createdAt: Date | null
    usuarioId: number | null
    disciplinaId: number | null
  }

  export type QuestaoCountAggregateOutputType = {
    id: number
    enunciado: number
    explicacao: number
    tema: number
    dificuldade: number
    createdAt: number
    usuarioId: number
    disciplinaId: number
    _all: number
  }


  export type QuestaoAvgAggregateInputType = {
    id?: true
    usuarioId?: true
    disciplinaId?: true
  }

  export type QuestaoSumAggregateInputType = {
    id?: true
    usuarioId?: true
    disciplinaId?: true
  }

  export type QuestaoMinAggregateInputType = {
    id?: true
    enunciado?: true
    explicacao?: true
    tema?: true
    dificuldade?: true
    createdAt?: true
    usuarioId?: true
    disciplinaId?: true
  }

  export type QuestaoMaxAggregateInputType = {
    id?: true
    enunciado?: true
    explicacao?: true
    tema?: true
    dificuldade?: true
    createdAt?: true
    usuarioId?: true
    disciplinaId?: true
  }

  export type QuestaoCountAggregateInputType = {
    id?: true
    enunciado?: true
    explicacao?: true
    tema?: true
    dificuldade?: true
    createdAt?: true
    usuarioId?: true
    disciplinaId?: true
    _all?: true
  }

  export type QuestaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questao to aggregate.
     */
    where?: QuestaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questaos to fetch.
     */
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questaos
    **/
    _count?: true | QuestaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestaoMaxAggregateInputType
  }

  export type GetQuestaoAggregateType<T extends QuestaoAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestao[P]>
      : GetScalarType<T[P], AggregateQuestao[P]>
  }




  export type QuestaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestaoWhereInput
    orderBy?: QuestaoOrderByWithAggregationInput | QuestaoOrderByWithAggregationInput[]
    by: QuestaoScalarFieldEnum[] | QuestaoScalarFieldEnum
    having?: QuestaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestaoCountAggregateInputType | true
    _avg?: QuestaoAvgAggregateInputType
    _sum?: QuestaoSumAggregateInputType
    _min?: QuestaoMinAggregateInputType
    _max?: QuestaoMaxAggregateInputType
  }

  export type QuestaoGroupByOutputType = {
    id: number
    enunciado: string
    explicacao: string | null
    tema: string | null
    dificuldade: string | null
    createdAt: Date
    usuarioId: number
    disciplinaId: number
    _count: QuestaoCountAggregateOutputType | null
    _avg: QuestaoAvgAggregateOutputType | null
    _sum: QuestaoSumAggregateOutputType | null
    _min: QuestaoMinAggregateOutputType | null
    _max: QuestaoMaxAggregateOutputType | null
  }

  type GetQuestaoGroupByPayload<T extends QuestaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestaoGroupByOutputType[P]>
            : GetScalarType<T[P], QuestaoGroupByOutputType[P]>
        }
      >
    >


  export type QuestaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enunciado?: boolean
    explicacao?: boolean
    tema?: boolean
    dificuldade?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    disciplinaId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
    alternativas?: boolean | Questao$alternativasArgs<ExtArgs>
    respostas?: boolean | Questao$respostasArgs<ExtArgs>
    _count?: boolean | QuestaoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questao"]>

  export type QuestaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enunciado?: boolean
    explicacao?: boolean
    tema?: boolean
    dificuldade?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    disciplinaId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questao"]>

  export type QuestaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enunciado?: boolean
    explicacao?: boolean
    tema?: boolean
    dificuldade?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    disciplinaId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questao"]>

  export type QuestaoSelectScalar = {
    id?: boolean
    enunciado?: boolean
    explicacao?: boolean
    tema?: boolean
    dificuldade?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    disciplinaId?: boolean
  }

  export type QuestaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "enunciado" | "explicacao" | "tema" | "dificuldade" | "createdAt" | "usuarioId" | "disciplinaId", ExtArgs["result"]["questao"]>
  export type QuestaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
    alternativas?: boolean | Questao$alternativasArgs<ExtArgs>
    respostas?: boolean | Questao$respostasArgs<ExtArgs>
    _count?: boolean | QuestaoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
  }
  export type QuestaoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    disciplina?: boolean | DisciplinaDefaultArgs<ExtArgs>
  }

  export type $QuestaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Questao"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      disciplina: Prisma.$DisciplinaPayload<ExtArgs>
      alternativas: Prisma.$AlternativaPayload<ExtArgs>[]
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      enunciado: string
      explicacao: string | null
      tema: string | null
      dificuldade: string | null
      createdAt: Date
      usuarioId: number
      disciplinaId: number
    }, ExtArgs["result"]["questao"]>
    composites: {}
  }

  type QuestaoGetPayload<S extends boolean | null | undefined | QuestaoDefaultArgs> = $Result.GetResult<Prisma.$QuestaoPayload, S>

  type QuestaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestaoCountAggregateInputType | true
    }

  export interface QuestaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Questao'], meta: { name: 'Questao' } }
    /**
     * Find zero or one Questao that matches the filter.
     * @param {QuestaoFindUniqueArgs} args - Arguments to find a Questao
     * @example
     * // Get one Questao
     * const questao = await prisma.questao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestaoFindUniqueArgs>(args: SelectSubset<T, QuestaoFindUniqueArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Questao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestaoFindUniqueOrThrowArgs} args - Arguments to find a Questao
     * @example
     * // Get one Questao
     * const questao = await prisma.questao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestaoFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoFindFirstArgs} args - Arguments to find a Questao
     * @example
     * // Get one Questao
     * const questao = await prisma.questao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestaoFindFirstArgs>(args?: SelectSubset<T, QuestaoFindFirstArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Questao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoFindFirstOrThrowArgs} args - Arguments to find a Questao
     * @example
     * // Get one Questao
     * const questao = await prisma.questao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestaoFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questaos
     * const questaos = await prisma.questao.findMany()
     * 
     * // Get first 10 Questaos
     * const questaos = await prisma.questao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questaoWithIdOnly = await prisma.questao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestaoFindManyArgs>(args?: SelectSubset<T, QuestaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Questao.
     * @param {QuestaoCreateArgs} args - Arguments to create a Questao.
     * @example
     * // Create one Questao
     * const Questao = await prisma.questao.create({
     *   data: {
     *     // ... data to create a Questao
     *   }
     * })
     * 
     */
    create<T extends QuestaoCreateArgs>(args: SelectSubset<T, QuestaoCreateArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questaos.
     * @param {QuestaoCreateManyArgs} args - Arguments to create many Questaos.
     * @example
     * // Create many Questaos
     * const questao = await prisma.questao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestaoCreateManyArgs>(args?: SelectSubset<T, QuestaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questaos and returns the data saved in the database.
     * @param {QuestaoCreateManyAndReturnArgs} args - Arguments to create many Questaos.
     * @example
     * // Create many Questaos
     * const questao = await prisma.questao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questaos and only return the `id`
     * const questaoWithIdOnly = await prisma.questao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestaoCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Questao.
     * @param {QuestaoDeleteArgs} args - Arguments to delete one Questao.
     * @example
     * // Delete one Questao
     * const Questao = await prisma.questao.delete({
     *   where: {
     *     // ... filter to delete one Questao
     *   }
     * })
     * 
     */
    delete<T extends QuestaoDeleteArgs>(args: SelectSubset<T, QuestaoDeleteArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Questao.
     * @param {QuestaoUpdateArgs} args - Arguments to update one Questao.
     * @example
     * // Update one Questao
     * const questao = await prisma.questao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestaoUpdateArgs>(args: SelectSubset<T, QuestaoUpdateArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questaos.
     * @param {QuestaoDeleteManyArgs} args - Arguments to filter Questaos to delete.
     * @example
     * // Delete a few Questaos
     * const { count } = await prisma.questao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestaoDeleteManyArgs>(args?: SelectSubset<T, QuestaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questaos
     * const questao = await prisma.questao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestaoUpdateManyArgs>(args: SelectSubset<T, QuestaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questaos and returns the data updated in the database.
     * @param {QuestaoUpdateManyAndReturnArgs} args - Arguments to update many Questaos.
     * @example
     * // Update many Questaos
     * const questao = await prisma.questao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questaos and only return the `id`
     * const questaoWithIdOnly = await prisma.questao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuestaoUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Questao.
     * @param {QuestaoUpsertArgs} args - Arguments to update or create a Questao.
     * @example
     * // Update or create a Questao
     * const questao = await prisma.questao.upsert({
     *   create: {
     *     // ... data to create a Questao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Questao we want to update
     *   }
     * })
     */
    upsert<T extends QuestaoUpsertArgs>(args: SelectSubset<T, QuestaoUpsertArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoCountArgs} args - Arguments to filter Questaos to count.
     * @example
     * // Count the number of Questaos
     * const count = await prisma.questao.count({
     *   where: {
     *     // ... the filter for the Questaos we want to count
     *   }
     * })
    **/
    count<T extends QuestaoCountArgs>(
      args?: Subset<T, QuestaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Questao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuestaoAggregateArgs>(args: Subset<T, QuestaoAggregateArgs>): Prisma.PrismaPromise<GetQuestaoAggregateType<T>>

    /**
     * Group by Questao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuestaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestaoGroupByArgs['orderBy'] }
        : { orderBy?: QuestaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuestaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Questao model
   */
  readonly fields: QuestaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Questao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    disciplina<T extends DisciplinaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DisciplinaDefaultArgs<ExtArgs>>): Prisma__DisciplinaClient<$Result.GetResult<Prisma.$DisciplinaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    alternativas<T extends Questao$alternativasArgs<ExtArgs> = {}>(args?: Subset<T, Questao$alternativasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    respostas<T extends Questao$respostasArgs<ExtArgs> = {}>(args?: Subset<T, Questao$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Questao model
   */
  interface QuestaoFieldRefs {
    readonly id: FieldRef<"Questao", 'Int'>
    readonly enunciado: FieldRef<"Questao", 'String'>
    readonly explicacao: FieldRef<"Questao", 'String'>
    readonly tema: FieldRef<"Questao", 'String'>
    readonly dificuldade: FieldRef<"Questao", 'String'>
    readonly createdAt: FieldRef<"Questao", 'DateTime'>
    readonly usuarioId: FieldRef<"Questao", 'Int'>
    readonly disciplinaId: FieldRef<"Questao", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Questao findUnique
   */
  export type QuestaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter, which Questao to fetch.
     */
    where: QuestaoWhereUniqueInput
  }

  /**
   * Questao findUniqueOrThrow
   */
  export type QuestaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter, which Questao to fetch.
     */
    where: QuestaoWhereUniqueInput
  }

  /**
   * Questao findFirst
   */
  export type QuestaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter, which Questao to fetch.
     */
    where?: QuestaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questaos to fetch.
     */
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questaos.
     */
    cursor?: QuestaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questaos.
     */
    distinct?: QuestaoScalarFieldEnum | QuestaoScalarFieldEnum[]
  }

  /**
   * Questao findFirstOrThrow
   */
  export type QuestaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter, which Questao to fetch.
     */
    where?: QuestaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questaos to fetch.
     */
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questaos.
     */
    cursor?: QuestaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questaos.
     */
    distinct?: QuestaoScalarFieldEnum | QuestaoScalarFieldEnum[]
  }

  /**
   * Questao findMany
   */
  export type QuestaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter, which Questaos to fetch.
     */
    where?: QuestaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questaos to fetch.
     */
    orderBy?: QuestaoOrderByWithRelationInput | QuestaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questaos.
     */
    cursor?: QuestaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questaos.
     */
    skip?: number
    distinct?: QuestaoScalarFieldEnum | QuestaoScalarFieldEnum[]
  }

  /**
   * Questao create
   */
  export type QuestaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * The data needed to create a Questao.
     */
    data: XOR<QuestaoCreateInput, QuestaoUncheckedCreateInput>
  }

  /**
   * Questao createMany
   */
  export type QuestaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questaos.
     */
    data: QuestaoCreateManyInput | QuestaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Questao createManyAndReturn
   */
  export type QuestaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * The data used to create many Questaos.
     */
    data: QuestaoCreateManyInput | QuestaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questao update
   */
  export type QuestaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * The data needed to update a Questao.
     */
    data: XOR<QuestaoUpdateInput, QuestaoUncheckedUpdateInput>
    /**
     * Choose, which Questao to update.
     */
    where: QuestaoWhereUniqueInput
  }

  /**
   * Questao updateMany
   */
  export type QuestaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questaos.
     */
    data: XOR<QuestaoUpdateManyMutationInput, QuestaoUncheckedUpdateManyInput>
    /**
     * Filter which Questaos to update
     */
    where?: QuestaoWhereInput
    /**
     * Limit how many Questaos to update.
     */
    limit?: number
  }

  /**
   * Questao updateManyAndReturn
   */
  export type QuestaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * The data used to update Questaos.
     */
    data: XOR<QuestaoUpdateManyMutationInput, QuestaoUncheckedUpdateManyInput>
    /**
     * Filter which Questaos to update
     */
    where?: QuestaoWhereInput
    /**
     * Limit how many Questaos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Questao upsert
   */
  export type QuestaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * The filter to search for the Questao to update in case it exists.
     */
    where: QuestaoWhereUniqueInput
    /**
     * In case the Questao found by the `where` argument doesn't exist, create a new Questao with this data.
     */
    create: XOR<QuestaoCreateInput, QuestaoUncheckedCreateInput>
    /**
     * In case the Questao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestaoUpdateInput, QuestaoUncheckedUpdateInput>
  }

  /**
   * Questao delete
   */
  export type QuestaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
    /**
     * Filter which Questao to delete.
     */
    where: QuestaoWhereUniqueInput
  }

  /**
   * Questao deleteMany
   */
  export type QuestaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questaos to delete
     */
    where?: QuestaoWhereInput
    /**
     * Limit how many Questaos to delete.
     */
    limit?: number
  }

  /**
   * Questao.alternativas
   */
  export type Questao$alternativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    where?: AlternativaWhereInput
    orderBy?: AlternativaOrderByWithRelationInput | AlternativaOrderByWithRelationInput[]
    cursor?: AlternativaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlternativaScalarFieldEnum | AlternativaScalarFieldEnum[]
  }

  /**
   * Questao.respostas
   */
  export type Questao$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Questao without action
   */
  export type QuestaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Questao
     */
    select?: QuestaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Questao
     */
    omit?: QuestaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestaoInclude<ExtArgs> | null
  }


  /**
   * Model Alternativa
   */

  export type AggregateAlternativa = {
    _count: AlternativaCountAggregateOutputType | null
    _avg: AlternativaAvgAggregateOutputType | null
    _sum: AlternativaSumAggregateOutputType | null
    _min: AlternativaMinAggregateOutputType | null
    _max: AlternativaMaxAggregateOutputType | null
  }

  export type AlternativaAvgAggregateOutputType = {
    id: number | null
    questaoId: number | null
  }

  export type AlternativaSumAggregateOutputType = {
    id: number | null
    questaoId: number | null
  }

  export type AlternativaMinAggregateOutputType = {
    id: number | null
    texto: string | null
    correta: boolean | null
    questaoId: number | null
  }

  export type AlternativaMaxAggregateOutputType = {
    id: number | null
    texto: string | null
    correta: boolean | null
    questaoId: number | null
  }

  export type AlternativaCountAggregateOutputType = {
    id: number
    texto: number
    correta: number
    questaoId: number
    _all: number
  }


  export type AlternativaAvgAggregateInputType = {
    id?: true
    questaoId?: true
  }

  export type AlternativaSumAggregateInputType = {
    id?: true
    questaoId?: true
  }

  export type AlternativaMinAggregateInputType = {
    id?: true
    texto?: true
    correta?: true
    questaoId?: true
  }

  export type AlternativaMaxAggregateInputType = {
    id?: true
    texto?: true
    correta?: true
    questaoId?: true
  }

  export type AlternativaCountAggregateInputType = {
    id?: true
    texto?: true
    correta?: true
    questaoId?: true
    _all?: true
  }

  export type AlternativaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alternativa to aggregate.
     */
    where?: AlternativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alternativas to fetch.
     */
    orderBy?: AlternativaOrderByWithRelationInput | AlternativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlternativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alternativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alternativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alternativas
    **/
    _count?: true | AlternativaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlternativaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlternativaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlternativaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlternativaMaxAggregateInputType
  }

  export type GetAlternativaAggregateType<T extends AlternativaAggregateArgs> = {
        [P in keyof T & keyof AggregateAlternativa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlternativa[P]>
      : GetScalarType<T[P], AggregateAlternativa[P]>
  }




  export type AlternativaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlternativaWhereInput
    orderBy?: AlternativaOrderByWithAggregationInput | AlternativaOrderByWithAggregationInput[]
    by: AlternativaScalarFieldEnum[] | AlternativaScalarFieldEnum
    having?: AlternativaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlternativaCountAggregateInputType | true
    _avg?: AlternativaAvgAggregateInputType
    _sum?: AlternativaSumAggregateInputType
    _min?: AlternativaMinAggregateInputType
    _max?: AlternativaMaxAggregateInputType
  }

  export type AlternativaGroupByOutputType = {
    id: number
    texto: string
    correta: boolean
    questaoId: number
    _count: AlternativaCountAggregateOutputType | null
    _avg: AlternativaAvgAggregateOutputType | null
    _sum: AlternativaSumAggregateOutputType | null
    _min: AlternativaMinAggregateOutputType | null
    _max: AlternativaMaxAggregateOutputType | null
  }

  type GetAlternativaGroupByPayload<T extends AlternativaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlternativaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlternativaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlternativaGroupByOutputType[P]>
            : GetScalarType<T[P], AlternativaGroupByOutputType[P]>
        }
      >
    >


  export type AlternativaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    correta?: boolean
    questaoId?: boolean
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alternativa"]>

  export type AlternativaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    correta?: boolean
    questaoId?: boolean
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alternativa"]>

  export type AlternativaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    texto?: boolean
    correta?: boolean
    questaoId?: boolean
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alternativa"]>

  export type AlternativaSelectScalar = {
    id?: boolean
    texto?: boolean
    correta?: boolean
    questaoId?: boolean
  }

  export type AlternativaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "texto" | "correta" | "questaoId", ExtArgs["result"]["alternativa"]>
  export type AlternativaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }
  export type AlternativaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }
  export type AlternativaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }

  export type $AlternativaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alternativa"
    objects: {
      questao: Prisma.$QuestaoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      texto: string
      correta: boolean
      questaoId: number
    }, ExtArgs["result"]["alternativa"]>
    composites: {}
  }

  type AlternativaGetPayload<S extends boolean | null | undefined | AlternativaDefaultArgs> = $Result.GetResult<Prisma.$AlternativaPayload, S>

  type AlternativaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlternativaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlternativaCountAggregateInputType | true
    }

  export interface AlternativaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alternativa'], meta: { name: 'Alternativa' } }
    /**
     * Find zero or one Alternativa that matches the filter.
     * @param {AlternativaFindUniqueArgs} args - Arguments to find a Alternativa
     * @example
     * // Get one Alternativa
     * const alternativa = await prisma.alternativa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlternativaFindUniqueArgs>(args: SelectSubset<T, AlternativaFindUniqueArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Alternativa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlternativaFindUniqueOrThrowArgs} args - Arguments to find a Alternativa
     * @example
     * // Get one Alternativa
     * const alternativa = await prisma.alternativa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlternativaFindUniqueOrThrowArgs>(args: SelectSubset<T, AlternativaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alternativa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaFindFirstArgs} args - Arguments to find a Alternativa
     * @example
     * // Get one Alternativa
     * const alternativa = await prisma.alternativa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlternativaFindFirstArgs>(args?: SelectSubset<T, AlternativaFindFirstArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alternativa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaFindFirstOrThrowArgs} args - Arguments to find a Alternativa
     * @example
     * // Get one Alternativa
     * const alternativa = await prisma.alternativa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlternativaFindFirstOrThrowArgs>(args?: SelectSubset<T, AlternativaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Alternativas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alternativas
     * const alternativas = await prisma.alternativa.findMany()
     * 
     * // Get first 10 Alternativas
     * const alternativas = await prisma.alternativa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alternativaWithIdOnly = await prisma.alternativa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlternativaFindManyArgs>(args?: SelectSubset<T, AlternativaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Alternativa.
     * @param {AlternativaCreateArgs} args - Arguments to create a Alternativa.
     * @example
     * // Create one Alternativa
     * const Alternativa = await prisma.alternativa.create({
     *   data: {
     *     // ... data to create a Alternativa
     *   }
     * })
     * 
     */
    create<T extends AlternativaCreateArgs>(args: SelectSubset<T, AlternativaCreateArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Alternativas.
     * @param {AlternativaCreateManyArgs} args - Arguments to create many Alternativas.
     * @example
     * // Create many Alternativas
     * const alternativa = await prisma.alternativa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlternativaCreateManyArgs>(args?: SelectSubset<T, AlternativaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alternativas and returns the data saved in the database.
     * @param {AlternativaCreateManyAndReturnArgs} args - Arguments to create many Alternativas.
     * @example
     * // Create many Alternativas
     * const alternativa = await prisma.alternativa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alternativas and only return the `id`
     * const alternativaWithIdOnly = await prisma.alternativa.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlternativaCreateManyAndReturnArgs>(args?: SelectSubset<T, AlternativaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Alternativa.
     * @param {AlternativaDeleteArgs} args - Arguments to delete one Alternativa.
     * @example
     * // Delete one Alternativa
     * const Alternativa = await prisma.alternativa.delete({
     *   where: {
     *     // ... filter to delete one Alternativa
     *   }
     * })
     * 
     */
    delete<T extends AlternativaDeleteArgs>(args: SelectSubset<T, AlternativaDeleteArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Alternativa.
     * @param {AlternativaUpdateArgs} args - Arguments to update one Alternativa.
     * @example
     * // Update one Alternativa
     * const alternativa = await prisma.alternativa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlternativaUpdateArgs>(args: SelectSubset<T, AlternativaUpdateArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Alternativas.
     * @param {AlternativaDeleteManyArgs} args - Arguments to filter Alternativas to delete.
     * @example
     * // Delete a few Alternativas
     * const { count } = await prisma.alternativa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlternativaDeleteManyArgs>(args?: SelectSubset<T, AlternativaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alternativas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alternativas
     * const alternativa = await prisma.alternativa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlternativaUpdateManyArgs>(args: SelectSubset<T, AlternativaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alternativas and returns the data updated in the database.
     * @param {AlternativaUpdateManyAndReturnArgs} args - Arguments to update many Alternativas.
     * @example
     * // Update many Alternativas
     * const alternativa = await prisma.alternativa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Alternativas and only return the `id`
     * const alternativaWithIdOnly = await prisma.alternativa.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlternativaUpdateManyAndReturnArgs>(args: SelectSubset<T, AlternativaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Alternativa.
     * @param {AlternativaUpsertArgs} args - Arguments to update or create a Alternativa.
     * @example
     * // Update or create a Alternativa
     * const alternativa = await prisma.alternativa.upsert({
     *   create: {
     *     // ... data to create a Alternativa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alternativa we want to update
     *   }
     * })
     */
    upsert<T extends AlternativaUpsertArgs>(args: SelectSubset<T, AlternativaUpsertArgs<ExtArgs>>): Prisma__AlternativaClient<$Result.GetResult<Prisma.$AlternativaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Alternativas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaCountArgs} args - Arguments to filter Alternativas to count.
     * @example
     * // Count the number of Alternativas
     * const count = await prisma.alternativa.count({
     *   where: {
     *     // ... the filter for the Alternativas we want to count
     *   }
     * })
    **/
    count<T extends AlternativaCountArgs>(
      args?: Subset<T, AlternativaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlternativaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alternativa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlternativaAggregateArgs>(args: Subset<T, AlternativaAggregateArgs>): Prisma.PrismaPromise<GetAlternativaAggregateType<T>>

    /**
     * Group by Alternativa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlternativaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlternativaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlternativaGroupByArgs['orderBy'] }
        : { orderBy?: AlternativaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlternativaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlternativaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alternativa model
   */
  readonly fields: AlternativaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alternativa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlternativaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    questao<T extends QuestaoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestaoDefaultArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Alternativa model
   */
  interface AlternativaFieldRefs {
    readonly id: FieldRef<"Alternativa", 'Int'>
    readonly texto: FieldRef<"Alternativa", 'String'>
    readonly correta: FieldRef<"Alternativa", 'Boolean'>
    readonly questaoId: FieldRef<"Alternativa", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Alternativa findUnique
   */
  export type AlternativaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter, which Alternativa to fetch.
     */
    where: AlternativaWhereUniqueInput
  }

  /**
   * Alternativa findUniqueOrThrow
   */
  export type AlternativaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter, which Alternativa to fetch.
     */
    where: AlternativaWhereUniqueInput
  }

  /**
   * Alternativa findFirst
   */
  export type AlternativaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter, which Alternativa to fetch.
     */
    where?: AlternativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alternativas to fetch.
     */
    orderBy?: AlternativaOrderByWithRelationInput | AlternativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alternativas.
     */
    cursor?: AlternativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alternativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alternativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alternativas.
     */
    distinct?: AlternativaScalarFieldEnum | AlternativaScalarFieldEnum[]
  }

  /**
   * Alternativa findFirstOrThrow
   */
  export type AlternativaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter, which Alternativa to fetch.
     */
    where?: AlternativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alternativas to fetch.
     */
    orderBy?: AlternativaOrderByWithRelationInput | AlternativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alternativas.
     */
    cursor?: AlternativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alternativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alternativas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alternativas.
     */
    distinct?: AlternativaScalarFieldEnum | AlternativaScalarFieldEnum[]
  }

  /**
   * Alternativa findMany
   */
  export type AlternativaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter, which Alternativas to fetch.
     */
    where?: AlternativaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alternativas to fetch.
     */
    orderBy?: AlternativaOrderByWithRelationInput | AlternativaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alternativas.
     */
    cursor?: AlternativaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alternativas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alternativas.
     */
    skip?: number
    distinct?: AlternativaScalarFieldEnum | AlternativaScalarFieldEnum[]
  }

  /**
   * Alternativa create
   */
  export type AlternativaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * The data needed to create a Alternativa.
     */
    data: XOR<AlternativaCreateInput, AlternativaUncheckedCreateInput>
  }

  /**
   * Alternativa createMany
   */
  export type AlternativaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alternativas.
     */
    data: AlternativaCreateManyInput | AlternativaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Alternativa createManyAndReturn
   */
  export type AlternativaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * The data used to create many Alternativas.
     */
    data: AlternativaCreateManyInput | AlternativaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alternativa update
   */
  export type AlternativaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * The data needed to update a Alternativa.
     */
    data: XOR<AlternativaUpdateInput, AlternativaUncheckedUpdateInput>
    /**
     * Choose, which Alternativa to update.
     */
    where: AlternativaWhereUniqueInput
  }

  /**
   * Alternativa updateMany
   */
  export type AlternativaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alternativas.
     */
    data: XOR<AlternativaUpdateManyMutationInput, AlternativaUncheckedUpdateManyInput>
    /**
     * Filter which Alternativas to update
     */
    where?: AlternativaWhereInput
    /**
     * Limit how many Alternativas to update.
     */
    limit?: number
  }

  /**
   * Alternativa updateManyAndReturn
   */
  export type AlternativaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * The data used to update Alternativas.
     */
    data: XOR<AlternativaUpdateManyMutationInput, AlternativaUncheckedUpdateManyInput>
    /**
     * Filter which Alternativas to update
     */
    where?: AlternativaWhereInput
    /**
     * Limit how many Alternativas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Alternativa upsert
   */
  export type AlternativaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * The filter to search for the Alternativa to update in case it exists.
     */
    where: AlternativaWhereUniqueInput
    /**
     * In case the Alternativa found by the `where` argument doesn't exist, create a new Alternativa with this data.
     */
    create: XOR<AlternativaCreateInput, AlternativaUncheckedCreateInput>
    /**
     * In case the Alternativa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlternativaUpdateInput, AlternativaUncheckedUpdateInput>
  }

  /**
   * Alternativa delete
   */
  export type AlternativaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
    /**
     * Filter which Alternativa to delete.
     */
    where: AlternativaWhereUniqueInput
  }

  /**
   * Alternativa deleteMany
   */
  export type AlternativaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alternativas to delete
     */
    where?: AlternativaWhereInput
    /**
     * Limit how many Alternativas to delete.
     */
    limit?: number
  }

  /**
   * Alternativa without action
   */
  export type AlternativaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alternativa
     */
    select?: AlternativaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alternativa
     */
    omit?: AlternativaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlternativaInclude<ExtArgs> | null
  }


  /**
   * Model Resposta
   */

  export type AggregateResposta = {
    _count: RespostaCountAggregateOutputType | null
    _avg: RespostaAvgAggregateOutputType | null
    _sum: RespostaSumAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  export type RespostaAvgAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    questaoId: number | null
  }

  export type RespostaSumAggregateOutputType = {
    id: number | null
    usuarioId: number | null
    questaoId: number | null
  }

  export type RespostaMinAggregateOutputType = {
    id: number | null
    correta: boolean | null
    respondidaAt: Date | null
    usuarioId: number | null
    questaoId: number | null
  }

  export type RespostaMaxAggregateOutputType = {
    id: number | null
    correta: boolean | null
    respondidaAt: Date | null
    usuarioId: number | null
    questaoId: number | null
  }

  export type RespostaCountAggregateOutputType = {
    id: number
    correta: number
    respondidaAt: number
    usuarioId: number
    questaoId: number
    _all: number
  }


  export type RespostaAvgAggregateInputType = {
    id?: true
    usuarioId?: true
    questaoId?: true
  }

  export type RespostaSumAggregateInputType = {
    id?: true
    usuarioId?: true
    questaoId?: true
  }

  export type RespostaMinAggregateInputType = {
    id?: true
    correta?: true
    respondidaAt?: true
    usuarioId?: true
    questaoId?: true
  }

  export type RespostaMaxAggregateInputType = {
    id?: true
    correta?: true
    respondidaAt?: true
    usuarioId?: true
    questaoId?: true
  }

  export type RespostaCountAggregateInputType = {
    id?: true
    correta?: true
    respondidaAt?: true
    usuarioId?: true
    questaoId?: true
    _all?: true
  }

  export type RespostaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resposta to aggregate.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Respostas
    **/
    _count?: true | RespostaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RespostaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RespostaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RespostaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RespostaMaxAggregateInputType
  }

  export type GetRespostaAggregateType<T extends RespostaAggregateArgs> = {
        [P in keyof T & keyof AggregateResposta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResposta[P]>
      : GetScalarType<T[P], AggregateResposta[P]>
  }




  export type RespostaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithAggregationInput | RespostaOrderByWithAggregationInput[]
    by: RespostaScalarFieldEnum[] | RespostaScalarFieldEnum
    having?: RespostaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RespostaCountAggregateInputType | true
    _avg?: RespostaAvgAggregateInputType
    _sum?: RespostaSumAggregateInputType
    _min?: RespostaMinAggregateInputType
    _max?: RespostaMaxAggregateInputType
  }

  export type RespostaGroupByOutputType = {
    id: number
    correta: boolean
    respondidaAt: Date
    usuarioId: number
    questaoId: number
    _count: RespostaCountAggregateOutputType | null
    _avg: RespostaAvgAggregateOutputType | null
    _sum: RespostaSumAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  type GetRespostaGroupByPayload<T extends RespostaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RespostaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RespostaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RespostaGroupByOutputType[P]>
            : GetScalarType<T[P], RespostaGroupByOutputType[P]>
        }
      >
    >


  export type RespostaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    correta?: boolean
    respondidaAt?: boolean
    usuarioId?: boolean
    questaoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    correta?: boolean
    respondidaAt?: boolean
    usuarioId?: boolean
    questaoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    correta?: boolean
    respondidaAt?: boolean
    usuarioId?: boolean
    questaoId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>

  export type RespostaSelectScalar = {
    id?: boolean
    correta?: boolean
    respondidaAt?: boolean
    usuarioId?: boolean
    questaoId?: boolean
  }

  export type RespostaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "correta" | "respondidaAt" | "usuarioId" | "questaoId", ExtArgs["result"]["resposta"]>
  export type RespostaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }
  export type RespostaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }
  export type RespostaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    questao?: boolean | QuestaoDefaultArgs<ExtArgs>
  }

  export type $RespostaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resposta"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      questao: Prisma.$QuestaoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      correta: boolean
      respondidaAt: Date
      usuarioId: number
      questaoId: number
    }, ExtArgs["result"]["resposta"]>
    composites: {}
  }

  type RespostaGetPayload<S extends boolean | null | undefined | RespostaDefaultArgs> = $Result.GetResult<Prisma.$RespostaPayload, S>

  type RespostaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RespostaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RespostaCountAggregateInputType | true
    }

  export interface RespostaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resposta'], meta: { name: 'Resposta' } }
    /**
     * Find zero or one Resposta that matches the filter.
     * @param {RespostaFindUniqueArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RespostaFindUniqueArgs>(args: SelectSubset<T, RespostaFindUniqueArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resposta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RespostaFindUniqueOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RespostaFindUniqueOrThrowArgs>(args: SelectSubset<T, RespostaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RespostaFindFirstArgs>(args?: SelectSubset<T, RespostaFindFirstArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RespostaFindFirstOrThrowArgs>(args?: SelectSubset<T, RespostaFindFirstOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Respostas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Respostas
     * const respostas = await prisma.resposta.findMany()
     * 
     * // Get first 10 Respostas
     * const respostas = await prisma.resposta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const respostaWithIdOnly = await prisma.resposta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RespostaFindManyArgs>(args?: SelectSubset<T, RespostaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resposta.
     * @param {RespostaCreateArgs} args - Arguments to create a Resposta.
     * @example
     * // Create one Resposta
     * const Resposta = await prisma.resposta.create({
     *   data: {
     *     // ... data to create a Resposta
     *   }
     * })
     * 
     */
    create<T extends RespostaCreateArgs>(args: SelectSubset<T, RespostaCreateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Respostas.
     * @param {RespostaCreateManyArgs} args - Arguments to create many Respostas.
     * @example
     * // Create many Respostas
     * const resposta = await prisma.resposta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RespostaCreateManyArgs>(args?: SelectSubset<T, RespostaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Respostas and returns the data saved in the database.
     * @param {RespostaCreateManyAndReturnArgs} args - Arguments to create many Respostas.
     * @example
     * // Create many Respostas
     * const resposta = await prisma.resposta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Respostas and only return the `id`
     * const respostaWithIdOnly = await prisma.resposta.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RespostaCreateManyAndReturnArgs>(args?: SelectSubset<T, RespostaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resposta.
     * @param {RespostaDeleteArgs} args - Arguments to delete one Resposta.
     * @example
     * // Delete one Resposta
     * const Resposta = await prisma.resposta.delete({
     *   where: {
     *     // ... filter to delete one Resposta
     *   }
     * })
     * 
     */
    delete<T extends RespostaDeleteArgs>(args: SelectSubset<T, RespostaDeleteArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resposta.
     * @param {RespostaUpdateArgs} args - Arguments to update one Resposta.
     * @example
     * // Update one Resposta
     * const resposta = await prisma.resposta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RespostaUpdateArgs>(args: SelectSubset<T, RespostaUpdateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Respostas.
     * @param {RespostaDeleteManyArgs} args - Arguments to filter Respostas to delete.
     * @example
     * // Delete a few Respostas
     * const { count } = await prisma.resposta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RespostaDeleteManyArgs>(args?: SelectSubset<T, RespostaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Respostas
     * const resposta = await prisma.resposta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RespostaUpdateManyArgs>(args: SelectSubset<T, RespostaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respostas and returns the data updated in the database.
     * @param {RespostaUpdateManyAndReturnArgs} args - Arguments to update many Respostas.
     * @example
     * // Update many Respostas
     * const resposta = await prisma.resposta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Respostas and only return the `id`
     * const respostaWithIdOnly = await prisma.resposta.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RespostaUpdateManyAndReturnArgs>(args: SelectSubset<T, RespostaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resposta.
     * @param {RespostaUpsertArgs} args - Arguments to update or create a Resposta.
     * @example
     * // Update or create a Resposta
     * const resposta = await prisma.resposta.upsert({
     *   create: {
     *     // ... data to create a Resposta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resposta we want to update
     *   }
     * })
     */
    upsert<T extends RespostaUpsertArgs>(args: SelectSubset<T, RespostaUpsertArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaCountArgs} args - Arguments to filter Respostas to count.
     * @example
     * // Count the number of Respostas
     * const count = await prisma.resposta.count({
     *   where: {
     *     // ... the filter for the Respostas we want to count
     *   }
     * })
    **/
    count<T extends RespostaCountArgs>(
      args?: Subset<T, RespostaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RespostaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RespostaAggregateArgs>(args: Subset<T, RespostaAggregateArgs>): Prisma.PrismaPromise<GetRespostaAggregateType<T>>

    /**
     * Group by Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RespostaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RespostaGroupByArgs['orderBy'] }
        : { orderBy?: RespostaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RespostaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespostaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resposta model
   */
  readonly fields: RespostaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resposta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RespostaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questao<T extends QuestaoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestaoDefaultArgs<ExtArgs>>): Prisma__QuestaoClient<$Result.GetResult<Prisma.$QuestaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resposta model
   */
  interface RespostaFieldRefs {
    readonly id: FieldRef<"Resposta", 'Int'>
    readonly correta: FieldRef<"Resposta", 'Boolean'>
    readonly respondidaAt: FieldRef<"Resposta", 'DateTime'>
    readonly usuarioId: FieldRef<"Resposta", 'Int'>
    readonly questaoId: FieldRef<"Resposta", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Resposta findUnique
   */
  export type RespostaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findUniqueOrThrow
   */
  export type RespostaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findFirst
   */
  export type RespostaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findFirstOrThrow
   */
  export type RespostaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findMany
   */
  export type RespostaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Respostas to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta create
   */
  export type RespostaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to create a Resposta.
     */
    data: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
  }

  /**
   * Resposta createMany
   */
  export type RespostaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Respostas.
     */
    data: RespostaCreateManyInput | RespostaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resposta createManyAndReturn
   */
  export type RespostaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * The data used to create many Respostas.
     */
    data: RespostaCreateManyInput | RespostaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resposta update
   */
  export type RespostaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to update a Resposta.
     */
    data: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
    /**
     * Choose, which Resposta to update.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta updateMany
   */
  export type RespostaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Respostas.
     */
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyInput>
    /**
     * Filter which Respostas to update
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to update.
     */
    limit?: number
  }

  /**
   * Resposta updateManyAndReturn
   */
  export type RespostaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * The data used to update Respostas.
     */
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyInput>
    /**
     * Filter which Respostas to update
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resposta upsert
   */
  export type RespostaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The filter to search for the Resposta to update in case it exists.
     */
    where: RespostaWhereUniqueInput
    /**
     * In case the Resposta found by the `where` argument doesn't exist, create a new Resposta with this data.
     */
    create: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
    /**
     * In case the Resposta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
  }

  /**
   * Resposta delete
   */
  export type RespostaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter which Resposta to delete.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta deleteMany
   */
  export type RespostaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Respostas to delete
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to delete.
     */
    limit?: number
  }

  /**
   * Resposta without action
   */
  export type RespostaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
  }


  /**
   * Model Flashcard
   */

  export type AggregateFlashcard = {
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  export type FlashcardAvgAggregateOutputType = {
    id: number | null
    usuarioId: number | null
  }

  export type FlashcardSumAggregateOutputType = {
    id: number | null
    usuarioId: number | null
  }

  export type FlashcardMinAggregateOutputType = {
    id: number | null
    frente: string | null
    verso: string | null
    createdAt: Date | null
    updatedAt: Date | null
    usuarioId: number | null
  }

  export type FlashcardMaxAggregateOutputType = {
    id: number | null
    frente: string | null
    verso: string | null
    createdAt: Date | null
    updatedAt: Date | null
    usuarioId: number | null
  }

  export type FlashcardCountAggregateOutputType = {
    id: number
    frente: number
    verso: number
    createdAt: number
    updatedAt: number
    usuarioId: number
    _all: number
  }


  export type FlashcardAvgAggregateInputType = {
    id?: true
    usuarioId?: true
  }

  export type FlashcardSumAggregateInputType = {
    id?: true
    usuarioId?: true
  }

  export type FlashcardMinAggregateInputType = {
    id?: true
    frente?: true
    verso?: true
    createdAt?: true
    updatedAt?: true
    usuarioId?: true
  }

  export type FlashcardMaxAggregateInputType = {
    id?: true
    frente?: true
    verso?: true
    createdAt?: true
    updatedAt?: true
    usuarioId?: true
  }

  export type FlashcardCountAggregateInputType = {
    id?: true
    frente?: true
    verso?: true
    createdAt?: true
    updatedAt?: true
    usuarioId?: true
    _all?: true
  }

  export type FlashcardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcard to aggregate.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flashcards
    **/
    _count?: true | FlashcardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlashcardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlashcardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardMaxAggregateInputType
  }

  export type GetFlashcardAggregateType<T extends FlashcardAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcard[P]>
      : GetScalarType<T[P], AggregateFlashcard[P]>
  }




  export type FlashcardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithAggregationInput | FlashcardOrderByWithAggregationInput[]
    by: FlashcardScalarFieldEnum[] | FlashcardScalarFieldEnum
    having?: FlashcardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardCountAggregateInputType | true
    _avg?: FlashcardAvgAggregateInputType
    _sum?: FlashcardSumAggregateInputType
    _min?: FlashcardMinAggregateInputType
    _max?: FlashcardMaxAggregateInputType
  }

  export type FlashcardGroupByOutputType = {
    id: number
    frente: string
    verso: string
    createdAt: Date
    updatedAt: Date
    usuarioId: number
    _count: FlashcardCountAggregateOutputType | null
    _avg: FlashcardAvgAggregateOutputType | null
    _sum: FlashcardSumAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  type GetFlashcardGroupByPayload<T extends FlashcardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frente?: boolean
    verso?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frente?: boolean
    verso?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frente?: boolean
    verso?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectScalar = {
    id?: boolean
    frente?: boolean
    verso?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarioId?: boolean
  }

  export type FlashcardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "frente" | "verso" | "createdAt" | "updatedAt" | "usuarioId", ExtArgs["result"]["flashcard"]>
  export type FlashcardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $FlashcardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flashcard"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      frente: string
      verso: string
      createdAt: Date
      updatedAt: Date
      usuarioId: number
    }, ExtArgs["result"]["flashcard"]>
    composites: {}
  }

  type FlashcardGetPayload<S extends boolean | null | undefined | FlashcardDefaultArgs> = $Result.GetResult<Prisma.$FlashcardPayload, S>

  type FlashcardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlashcardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlashcardCountAggregateInputType | true
    }

  export interface FlashcardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flashcard'], meta: { name: 'Flashcard' } }
    /**
     * Find zero or one Flashcard that matches the filter.
     * @param {FlashcardFindUniqueArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardFindUniqueArgs>(args: SelectSubset<T, FlashcardFindUniqueArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Flashcard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlashcardFindUniqueOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardFindFirstArgs>(args?: SelectSubset<T, FlashcardFindFirstArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Flashcards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flashcards
     * const flashcards = await prisma.flashcard.findMany()
     * 
     * // Get first 10 Flashcards
     * const flashcards = await prisma.flashcard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardFindManyArgs>(args?: SelectSubset<T, FlashcardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Flashcard.
     * @param {FlashcardCreateArgs} args - Arguments to create a Flashcard.
     * @example
     * // Create one Flashcard
     * const Flashcard = await prisma.flashcard.create({
     *   data: {
     *     // ... data to create a Flashcard
     *   }
     * })
     * 
     */
    create<T extends FlashcardCreateArgs>(args: SelectSubset<T, FlashcardCreateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Flashcards.
     * @param {FlashcardCreateManyArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardCreateManyArgs>(args?: SelectSubset<T, FlashcardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flashcards and returns the data saved in the database.
     * @param {FlashcardCreateManyAndReturnArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Flashcard.
     * @param {FlashcardDeleteArgs} args - Arguments to delete one Flashcard.
     * @example
     * // Delete one Flashcard
     * const Flashcard = await prisma.flashcard.delete({
     *   where: {
     *     // ... filter to delete one Flashcard
     *   }
     * })
     * 
     */
    delete<T extends FlashcardDeleteArgs>(args: SelectSubset<T, FlashcardDeleteArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Flashcard.
     * @param {FlashcardUpdateArgs} args - Arguments to update one Flashcard.
     * @example
     * // Update one Flashcard
     * const flashcard = await prisma.flashcard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardUpdateArgs>(args: SelectSubset<T, FlashcardUpdateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Flashcards.
     * @param {FlashcardDeleteManyArgs} args - Arguments to filter Flashcards to delete.
     * @example
     * // Delete a few Flashcards
     * const { count } = await prisma.flashcard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardDeleteManyArgs>(args?: SelectSubset<T, FlashcardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardUpdateManyArgs>(args: SelectSubset<T, FlashcardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards and returns the data updated in the database.
     * @param {FlashcardUpdateManyAndReturnArgs} args - Arguments to update many Flashcards.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlashcardUpdateManyAndReturnArgs>(args: SelectSubset<T, FlashcardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Flashcard.
     * @param {FlashcardUpsertArgs} args - Arguments to update or create a Flashcard.
     * @example
     * // Update or create a Flashcard
     * const flashcard = await prisma.flashcard.upsert({
     *   create: {
     *     // ... data to create a Flashcard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flashcard we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardUpsertArgs>(args: SelectSubset<T, FlashcardUpsertArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardCountArgs} args - Arguments to filter Flashcards to count.
     * @example
     * // Count the number of Flashcards
     * const count = await prisma.flashcard.count({
     *   where: {
     *     // ... the filter for the Flashcards we want to count
     *   }
     * })
    **/
    count<T extends FlashcardCountArgs>(
      args?: Subset<T, FlashcardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlashcardAggregateArgs>(args: Subset<T, FlashcardAggregateArgs>): Prisma.PrismaPromise<GetFlashcardAggregateType<T>>

    /**
     * Group by Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlashcardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlashcardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flashcard model
   */
  readonly fields: FlashcardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flashcard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Flashcard model
   */
  interface FlashcardFieldRefs {
    readonly id: FieldRef<"Flashcard", 'Int'>
    readonly frente: FieldRef<"Flashcard", 'String'>
    readonly verso: FieldRef<"Flashcard", 'String'>
    readonly createdAt: FieldRef<"Flashcard", 'DateTime'>
    readonly updatedAt: FieldRef<"Flashcard", 'DateTime'>
    readonly usuarioId: FieldRef<"Flashcard", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Flashcard findUnique
   */
  export type FlashcardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findUniqueOrThrow
   */
  export type FlashcardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findFirst
   */
  export type FlashcardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findFirstOrThrow
   */
  export type FlashcardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findMany
   */
  export type FlashcardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcards to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard create
   */
  export type FlashcardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to create a Flashcard.
     */
    data: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
  }

  /**
   * Flashcard createMany
   */
  export type FlashcardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flashcard createManyAndReturn
   */
  export type FlashcardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard update
   */
  export type FlashcardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to update a Flashcard.
     */
    data: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
    /**
     * Choose, which Flashcard to update.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard updateMany
   */
  export type FlashcardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
  }

  /**
   * Flashcard updateManyAndReturn
   */
  export type FlashcardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard upsert
   */
  export type FlashcardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The filter to search for the Flashcard to update in case it exists.
     */
    where: FlashcardWhereUniqueInput
    /**
     * In case the Flashcard found by the `where` argument doesn't exist, create a new Flashcard with this data.
     */
    create: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
    /**
     * In case the Flashcard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
  }

  /**
   * Flashcard delete
   */
  export type FlashcardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter which Flashcard to delete.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard deleteMany
   */
  export type FlashcardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcards to delete
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to delete.
     */
    limit?: number
  }

  /**
   * Flashcard without action
   */
  export type FlashcardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
  }


  /**
   * Model Movimentacao
   */

  export type AggregateMovimentacao = {
    _count: MovimentacaoCountAggregateOutputType | null
    _avg: MovimentacaoAvgAggregateOutputType | null
    _sum: MovimentacaoSumAggregateOutputType | null
    _min: MovimentacaoMinAggregateOutputType | null
    _max: MovimentacaoMaxAggregateOutputType | null
  }

  export type MovimentacaoAvgAggregateOutputType = {
    id: number | null
    valor: Decimal | null
    usuarioId: number | null
  }

  export type MovimentacaoSumAggregateOutputType = {
    id: number | null
    valor: Decimal | null
    usuarioId: number | null
  }

  export type MovimentacaoMinAggregateOutputType = {
    id: number | null
    descricao: string | null
    valor: Decimal | null
    tipo: $Enums.TipoMovimentacao | null
    data: Date | null
    createdAt: Date | null
    usuarioId: number | null
  }

  export type MovimentacaoMaxAggregateOutputType = {
    id: number | null
    descricao: string | null
    valor: Decimal | null
    tipo: $Enums.TipoMovimentacao | null
    data: Date | null
    createdAt: Date | null
    usuarioId: number | null
  }

  export type MovimentacaoCountAggregateOutputType = {
    id: number
    descricao: number
    valor: number
    tipo: number
    data: number
    createdAt: number
    usuarioId: number
    _all: number
  }


  export type MovimentacaoAvgAggregateInputType = {
    id?: true
    valor?: true
    usuarioId?: true
  }

  export type MovimentacaoSumAggregateInputType = {
    id?: true
    valor?: true
    usuarioId?: true
  }

  export type MovimentacaoMinAggregateInputType = {
    id?: true
    descricao?: true
    valor?: true
    tipo?: true
    data?: true
    createdAt?: true
    usuarioId?: true
  }

  export type MovimentacaoMaxAggregateInputType = {
    id?: true
    descricao?: true
    valor?: true
    tipo?: true
    data?: true
    createdAt?: true
    usuarioId?: true
  }

  export type MovimentacaoCountAggregateInputType = {
    id?: true
    descricao?: true
    valor?: true
    tipo?: true
    data?: true
    createdAt?: true
    usuarioId?: true
    _all?: true
  }

  export type MovimentacaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimentacao to aggregate.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Movimentacaos
    **/
    _count?: true | MovimentacaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovimentacaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovimentacaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovimentacaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovimentacaoMaxAggregateInputType
  }

  export type GetMovimentacaoAggregateType<T extends MovimentacaoAggregateArgs> = {
        [P in keyof T & keyof AggregateMovimentacao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovimentacao[P]>
      : GetScalarType<T[P], AggregateMovimentacao[P]>
  }




  export type MovimentacaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimentacaoWhereInput
    orderBy?: MovimentacaoOrderByWithAggregationInput | MovimentacaoOrderByWithAggregationInput[]
    by: MovimentacaoScalarFieldEnum[] | MovimentacaoScalarFieldEnum
    having?: MovimentacaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovimentacaoCountAggregateInputType | true
    _avg?: MovimentacaoAvgAggregateInputType
    _sum?: MovimentacaoSumAggregateInputType
    _min?: MovimentacaoMinAggregateInputType
    _max?: MovimentacaoMaxAggregateInputType
  }

  export type MovimentacaoGroupByOutputType = {
    id: number
    descricao: string
    valor: Decimal
    tipo: $Enums.TipoMovimentacao
    data: Date
    createdAt: Date
    usuarioId: number
    _count: MovimentacaoCountAggregateOutputType | null
    _avg: MovimentacaoAvgAggregateOutputType | null
    _sum: MovimentacaoSumAggregateOutputType | null
    _min: MovimentacaoMinAggregateOutputType | null
    _max: MovimentacaoMaxAggregateOutputType | null
  }

  type GetMovimentacaoGroupByPayload<T extends MovimentacaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovimentacaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovimentacaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovimentacaoGroupByOutputType[P]>
            : GetScalarType<T[P], MovimentacaoGroupByOutputType[P]>
        }
      >
    >


  export type MovimentacaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    descricao?: boolean
    valor?: boolean
    tipo?: boolean
    data?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimentacao"]>

  export type MovimentacaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    descricao?: boolean
    valor?: boolean
    tipo?: boolean
    data?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimentacao"]>

  export type MovimentacaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    descricao?: boolean
    valor?: boolean
    tipo?: boolean
    data?: boolean
    createdAt?: boolean
    usuarioId?: boolean
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimentacao"]>

  export type MovimentacaoSelectScalar = {
    id?: boolean
    descricao?: boolean
    valor?: boolean
    tipo?: boolean
    data?: boolean
    createdAt?: boolean
    usuarioId?: boolean
  }

  export type MovimentacaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "descricao" | "valor" | "tipo" | "data" | "createdAt" | "usuarioId", ExtArgs["result"]["movimentacao"]>
  export type MovimentacaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type MovimentacaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type MovimentacaoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $MovimentacaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Movimentacao"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      descricao: string
      valor: Prisma.Decimal
      tipo: $Enums.TipoMovimentacao
      data: Date
      createdAt: Date
      usuarioId: number
    }, ExtArgs["result"]["movimentacao"]>
    composites: {}
  }

  type MovimentacaoGetPayload<S extends boolean | null | undefined | MovimentacaoDefaultArgs> = $Result.GetResult<Prisma.$MovimentacaoPayload, S>

  type MovimentacaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MovimentacaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MovimentacaoCountAggregateInputType | true
    }

  export interface MovimentacaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Movimentacao'], meta: { name: 'Movimentacao' } }
    /**
     * Find zero or one Movimentacao that matches the filter.
     * @param {MovimentacaoFindUniqueArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovimentacaoFindUniqueArgs>(args: SelectSubset<T, MovimentacaoFindUniqueArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Movimentacao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MovimentacaoFindUniqueOrThrowArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovimentacaoFindUniqueOrThrowArgs>(args: SelectSubset<T, MovimentacaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Movimentacao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindFirstArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovimentacaoFindFirstArgs>(args?: SelectSubset<T, MovimentacaoFindFirstArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Movimentacao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindFirstOrThrowArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovimentacaoFindFirstOrThrowArgs>(args?: SelectSubset<T, MovimentacaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Movimentacaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Movimentacaos
     * const movimentacaos = await prisma.movimentacao.findMany()
     * 
     * // Get first 10 Movimentacaos
     * const movimentacaos = await prisma.movimentacao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movimentacaoWithIdOnly = await prisma.movimentacao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovimentacaoFindManyArgs>(args?: SelectSubset<T, MovimentacaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Movimentacao.
     * @param {MovimentacaoCreateArgs} args - Arguments to create a Movimentacao.
     * @example
     * // Create one Movimentacao
     * const Movimentacao = await prisma.movimentacao.create({
     *   data: {
     *     // ... data to create a Movimentacao
     *   }
     * })
     * 
     */
    create<T extends MovimentacaoCreateArgs>(args: SelectSubset<T, MovimentacaoCreateArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Movimentacaos.
     * @param {MovimentacaoCreateManyArgs} args - Arguments to create many Movimentacaos.
     * @example
     * // Create many Movimentacaos
     * const movimentacao = await prisma.movimentacao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovimentacaoCreateManyArgs>(args?: SelectSubset<T, MovimentacaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Movimentacaos and returns the data saved in the database.
     * @param {MovimentacaoCreateManyAndReturnArgs} args - Arguments to create many Movimentacaos.
     * @example
     * // Create many Movimentacaos
     * const movimentacao = await prisma.movimentacao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Movimentacaos and only return the `id`
     * const movimentacaoWithIdOnly = await prisma.movimentacao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovimentacaoCreateManyAndReturnArgs>(args?: SelectSubset<T, MovimentacaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Movimentacao.
     * @param {MovimentacaoDeleteArgs} args - Arguments to delete one Movimentacao.
     * @example
     * // Delete one Movimentacao
     * const Movimentacao = await prisma.movimentacao.delete({
     *   where: {
     *     // ... filter to delete one Movimentacao
     *   }
     * })
     * 
     */
    delete<T extends MovimentacaoDeleteArgs>(args: SelectSubset<T, MovimentacaoDeleteArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Movimentacao.
     * @param {MovimentacaoUpdateArgs} args - Arguments to update one Movimentacao.
     * @example
     * // Update one Movimentacao
     * const movimentacao = await prisma.movimentacao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovimentacaoUpdateArgs>(args: SelectSubset<T, MovimentacaoUpdateArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Movimentacaos.
     * @param {MovimentacaoDeleteManyArgs} args - Arguments to filter Movimentacaos to delete.
     * @example
     * // Delete a few Movimentacaos
     * const { count } = await prisma.movimentacao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovimentacaoDeleteManyArgs>(args?: SelectSubset<T, MovimentacaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movimentacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Movimentacaos
     * const movimentacao = await prisma.movimentacao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovimentacaoUpdateManyArgs>(args: SelectSubset<T, MovimentacaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movimentacaos and returns the data updated in the database.
     * @param {MovimentacaoUpdateManyAndReturnArgs} args - Arguments to update many Movimentacaos.
     * @example
     * // Update many Movimentacaos
     * const movimentacao = await prisma.movimentacao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Movimentacaos and only return the `id`
     * const movimentacaoWithIdOnly = await prisma.movimentacao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MovimentacaoUpdateManyAndReturnArgs>(args: SelectSubset<T, MovimentacaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Movimentacao.
     * @param {MovimentacaoUpsertArgs} args - Arguments to update or create a Movimentacao.
     * @example
     * // Update or create a Movimentacao
     * const movimentacao = await prisma.movimentacao.upsert({
     *   create: {
     *     // ... data to create a Movimentacao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Movimentacao we want to update
     *   }
     * })
     */
    upsert<T extends MovimentacaoUpsertArgs>(args: SelectSubset<T, MovimentacaoUpsertArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Movimentacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoCountArgs} args - Arguments to filter Movimentacaos to count.
     * @example
     * // Count the number of Movimentacaos
     * const count = await prisma.movimentacao.count({
     *   where: {
     *     // ... the filter for the Movimentacaos we want to count
     *   }
     * })
    **/
    count<T extends MovimentacaoCountArgs>(
      args?: Subset<T, MovimentacaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovimentacaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Movimentacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MovimentacaoAggregateArgs>(args: Subset<T, MovimentacaoAggregateArgs>): Prisma.PrismaPromise<GetMovimentacaoAggregateType<T>>

    /**
     * Group by Movimentacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MovimentacaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovimentacaoGroupByArgs['orderBy'] }
        : { orderBy?: MovimentacaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MovimentacaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovimentacaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Movimentacao model
   */
  readonly fields: MovimentacaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Movimentacao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovimentacaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Movimentacao model
   */
  interface MovimentacaoFieldRefs {
    readonly id: FieldRef<"Movimentacao", 'Int'>
    readonly descricao: FieldRef<"Movimentacao", 'String'>
    readonly valor: FieldRef<"Movimentacao", 'Decimal'>
    readonly tipo: FieldRef<"Movimentacao", 'TipoMovimentacao'>
    readonly data: FieldRef<"Movimentacao", 'DateTime'>
    readonly createdAt: FieldRef<"Movimentacao", 'DateTime'>
    readonly usuarioId: FieldRef<"Movimentacao", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Movimentacao findUnique
   */
  export type MovimentacaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao findUniqueOrThrow
   */
  export type MovimentacaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao findFirst
   */
  export type MovimentacaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimentacaos.
     */
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao findFirstOrThrow
   */
  export type MovimentacaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimentacaos.
     */
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao findMany
   */
  export type MovimentacaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacaos to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao create
   */
  export type MovimentacaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The data needed to create a Movimentacao.
     */
    data: XOR<MovimentacaoCreateInput, MovimentacaoUncheckedCreateInput>
  }

  /**
   * Movimentacao createMany
   */
  export type MovimentacaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Movimentacaos.
     */
    data: MovimentacaoCreateManyInput | MovimentacaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Movimentacao createManyAndReturn
   */
  export type MovimentacaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * The data used to create many Movimentacaos.
     */
    data: MovimentacaoCreateManyInput | MovimentacaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Movimentacao update
   */
  export type MovimentacaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The data needed to update a Movimentacao.
     */
    data: XOR<MovimentacaoUpdateInput, MovimentacaoUncheckedUpdateInput>
    /**
     * Choose, which Movimentacao to update.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao updateMany
   */
  export type MovimentacaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Movimentacaos.
     */
    data: XOR<MovimentacaoUpdateManyMutationInput, MovimentacaoUncheckedUpdateManyInput>
    /**
     * Filter which Movimentacaos to update
     */
    where?: MovimentacaoWhereInput
    /**
     * Limit how many Movimentacaos to update.
     */
    limit?: number
  }

  /**
   * Movimentacao updateManyAndReturn
   */
  export type MovimentacaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * The data used to update Movimentacaos.
     */
    data: XOR<MovimentacaoUpdateManyMutationInput, MovimentacaoUncheckedUpdateManyInput>
    /**
     * Filter which Movimentacaos to update
     */
    where?: MovimentacaoWhereInput
    /**
     * Limit how many Movimentacaos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Movimentacao upsert
   */
  export type MovimentacaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The filter to search for the Movimentacao to update in case it exists.
     */
    where: MovimentacaoWhereUniqueInput
    /**
     * In case the Movimentacao found by the `where` argument doesn't exist, create a new Movimentacao with this data.
     */
    create: XOR<MovimentacaoCreateInput, MovimentacaoUncheckedCreateInput>
    /**
     * In case the Movimentacao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovimentacaoUpdateInput, MovimentacaoUncheckedUpdateInput>
  }

  /**
   * Movimentacao delete
   */
  export type MovimentacaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter which Movimentacao to delete.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao deleteMany
   */
  export type MovimentacaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimentacaos to delete
     */
    where?: MovimentacaoWhereInput
    /**
     * Limit how many Movimentacaos to delete.
     */
    limit?: number
  }

  /**
   * Movimentacao without action
   */
  export type MovimentacaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Movimentacao
     */
    omit?: MovimentacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
  }


  /**
   * Model CasoClinico
   */

  export type AggregateCasoClinico = {
    _count: CasoClinicoCountAggregateOutputType | null
    _avg: CasoClinicoAvgAggregateOutputType | null
    _sum: CasoClinicoSumAggregateOutputType | null
    _min: CasoClinicoMinAggregateOutputType | null
    _max: CasoClinicoMaxAggregateOutputType | null
  }

  export type CasoClinicoAvgAggregateOutputType = {
    id: number | null
    autorId: number | null
  }

  export type CasoClinicoSumAggregateOutputType = {
    id: number | null
    autorId: number | null
  }

  export type CasoClinicoMinAggregateOutputType = {
    id: number | null
    titulo: string | null
    area: string | null
    especialidade: string | null
    dificuldade: string | null
    cenario: string | null
    queixaInicial: string | null
    diagnosticoFinal: string | null
    explicacaoDiagnostico: string | null
    publicado: boolean | null
    geradoPorIA: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    autorId: number | null
  }

  export type CasoClinicoMaxAggregateOutputType = {
    id: number | null
    titulo: string | null
    area: string | null
    especialidade: string | null
    dificuldade: string | null
    cenario: string | null
    queixaInicial: string | null
    diagnosticoFinal: string | null
    explicacaoDiagnostico: string | null
    publicado: boolean | null
    geradoPorIA: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    autorId: number | null
  }

  export type CasoClinicoCountAggregateOutputType = {
    id: number
    titulo: number
    area: number
    especialidade: number
    dificuldade: number
    cenario: number
    queixaInicial: number
    dadosIniciais: number
    anamnese: number
    exameFisico: number
    sinaisVitais: number
    exames: number
    evolucao: number
    diagnosticoFinal: number
    explicacaoDiagnostico: number
    diagnosticosDiferenciais: number
    pontosChave: number
    publicado: number
    geradoPorIA: number
    createdAt: number
    updatedAt: number
    autorId: number
    _all: number
  }


  export type CasoClinicoAvgAggregateInputType = {
    id?: true
    autorId?: true
  }

  export type CasoClinicoSumAggregateInputType = {
    id?: true
    autorId?: true
  }

  export type CasoClinicoMinAggregateInputType = {
    id?: true
    titulo?: true
    area?: true
    especialidade?: true
    dificuldade?: true
    cenario?: true
    queixaInicial?: true
    diagnosticoFinal?: true
    explicacaoDiagnostico?: true
    publicado?: true
    geradoPorIA?: true
    createdAt?: true
    updatedAt?: true
    autorId?: true
  }

  export type CasoClinicoMaxAggregateInputType = {
    id?: true
    titulo?: true
    area?: true
    especialidade?: true
    dificuldade?: true
    cenario?: true
    queixaInicial?: true
    diagnosticoFinal?: true
    explicacaoDiagnostico?: true
    publicado?: true
    geradoPorIA?: true
    createdAt?: true
    updatedAt?: true
    autorId?: true
  }

  export type CasoClinicoCountAggregateInputType = {
    id?: true
    titulo?: true
    area?: true
    especialidade?: true
    dificuldade?: true
    cenario?: true
    queixaInicial?: true
    dadosIniciais?: true
    anamnese?: true
    exameFisico?: true
    sinaisVitais?: true
    exames?: true
    evolucao?: true
    diagnosticoFinal?: true
    explicacaoDiagnostico?: true
    diagnosticosDiferenciais?: true
    pontosChave?: true
    publicado?: true
    geradoPorIA?: true
    createdAt?: true
    updatedAt?: true
    autorId?: true
    _all?: true
  }

  export type CasoClinicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CasoClinico to aggregate.
     */
    where?: CasoClinicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasoClinicos to fetch.
     */
    orderBy?: CasoClinicoOrderByWithRelationInput | CasoClinicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CasoClinicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasoClinicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasoClinicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CasoClinicos
    **/
    _count?: true | CasoClinicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CasoClinicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CasoClinicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CasoClinicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CasoClinicoMaxAggregateInputType
  }

  export type GetCasoClinicoAggregateType<T extends CasoClinicoAggregateArgs> = {
        [P in keyof T & keyof AggregateCasoClinico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCasoClinico[P]>
      : GetScalarType<T[P], AggregateCasoClinico[P]>
  }




  export type CasoClinicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CasoClinicoWhereInput
    orderBy?: CasoClinicoOrderByWithAggregationInput | CasoClinicoOrderByWithAggregationInput[]
    by: CasoClinicoScalarFieldEnum[] | CasoClinicoScalarFieldEnum
    having?: CasoClinicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CasoClinicoCountAggregateInputType | true
    _avg?: CasoClinicoAvgAggregateInputType
    _sum?: CasoClinicoSumAggregateInputType
    _min?: CasoClinicoMinAggregateInputType
    _max?: CasoClinicoMaxAggregateInputType
  }

  export type CasoClinicoGroupByOutputType = {
    id: number
    titulo: string
    area: string
    especialidade: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonValue
    anamnese: JsonValue
    exameFisico: JsonValue
    sinaisVitais: JsonValue
    exames: JsonValue
    evolucao: JsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonValue
    pontosChave: JsonValue
    publicado: boolean
    geradoPorIA: boolean
    createdAt: Date
    updatedAt: Date
    autorId: number
    _count: CasoClinicoCountAggregateOutputType | null
    _avg: CasoClinicoAvgAggregateOutputType | null
    _sum: CasoClinicoSumAggregateOutputType | null
    _min: CasoClinicoMinAggregateOutputType | null
    _max: CasoClinicoMaxAggregateOutputType | null
  }

  type GetCasoClinicoGroupByPayload<T extends CasoClinicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CasoClinicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CasoClinicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CasoClinicoGroupByOutputType[P]>
            : GetScalarType<T[P], CasoClinicoGroupByOutputType[P]>
        }
      >
    >


  export type CasoClinicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    area?: boolean
    especialidade?: boolean
    dificuldade?: boolean
    cenario?: boolean
    queixaInicial?: boolean
    dadosIniciais?: boolean
    anamnese?: boolean
    exameFisico?: boolean
    sinaisVitais?: boolean
    exames?: boolean
    evolucao?: boolean
    diagnosticoFinal?: boolean
    explicacaoDiagnostico?: boolean
    diagnosticosDiferenciais?: boolean
    pontosChave?: boolean
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    autorId?: boolean
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
    investigacoes?: boolean | CasoClinico$investigacoesArgs<ExtArgs>
    examesCaso?: boolean | CasoClinico$examesCasoArgs<ExtArgs>
    _count?: boolean | CasoClinicoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["casoClinico"]>

  export type CasoClinicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    area?: boolean
    especialidade?: boolean
    dificuldade?: boolean
    cenario?: boolean
    queixaInicial?: boolean
    dadosIniciais?: boolean
    anamnese?: boolean
    exameFisico?: boolean
    sinaisVitais?: boolean
    exames?: boolean
    evolucao?: boolean
    diagnosticoFinal?: boolean
    explicacaoDiagnostico?: boolean
    diagnosticosDiferenciais?: boolean
    pontosChave?: boolean
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    autorId?: boolean
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["casoClinico"]>

  export type CasoClinicoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    area?: boolean
    especialidade?: boolean
    dificuldade?: boolean
    cenario?: boolean
    queixaInicial?: boolean
    dadosIniciais?: boolean
    anamnese?: boolean
    exameFisico?: boolean
    sinaisVitais?: boolean
    exames?: boolean
    evolucao?: boolean
    diagnosticoFinal?: boolean
    explicacaoDiagnostico?: boolean
    diagnosticosDiferenciais?: boolean
    pontosChave?: boolean
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    autorId?: boolean
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["casoClinico"]>

  export type CasoClinicoSelectScalar = {
    id?: boolean
    titulo?: boolean
    area?: boolean
    especialidade?: boolean
    dificuldade?: boolean
    cenario?: boolean
    queixaInicial?: boolean
    dadosIniciais?: boolean
    anamnese?: boolean
    exameFisico?: boolean
    sinaisVitais?: boolean
    exames?: boolean
    evolucao?: boolean
    diagnosticoFinal?: boolean
    explicacaoDiagnostico?: boolean
    diagnosticosDiferenciais?: boolean
    pontosChave?: boolean
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    autorId?: boolean
  }

  export type CasoClinicoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "titulo" | "area" | "especialidade" | "dificuldade" | "cenario" | "queixaInicial" | "dadosIniciais" | "anamnese" | "exameFisico" | "sinaisVitais" | "exames" | "evolucao" | "diagnosticoFinal" | "explicacaoDiagnostico" | "diagnosticosDiferenciais" | "pontosChave" | "publicado" | "geradoPorIA" | "createdAt" | "updatedAt" | "autorId", ExtArgs["result"]["casoClinico"]>
  export type CasoClinicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
    investigacoes?: boolean | CasoClinico$investigacoesArgs<ExtArgs>
    examesCaso?: boolean | CasoClinico$examesCasoArgs<ExtArgs>
    _count?: boolean | CasoClinicoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CasoClinicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type CasoClinicoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    autor?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $CasoClinicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CasoClinico"
    objects: {
      autor: Prisma.$UsuarioPayload<ExtArgs>
      investigacoes: Prisma.$InvestigacaoCasoPayload<ExtArgs>[]
      examesCaso: Prisma.$ExameCasoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      titulo: string
      area: string
      especialidade: string | null
      dificuldade: string
      cenario: string
      queixaInicial: string
      /**
       * *
       *    * Informações apresentadas automaticamente no início.
       *    * Nunca devem conter o diagnóstico final.
       */
      dadosIniciais: Prisma.JsonValue
      /**
       * *
       *    * Informações que o servidor libera
       *    * somente quando o usuário solicita.
       */
      anamnese: Prisma.JsonValue
      exameFisico: Prisma.JsonValue
      sinaisVitais: Prisma.JsonValue
      /**
       * *
       *    * Mantido para informações gerais do caso.
       *    * Os exames solicitáveis individualmente ficam em ExameCaso.
       */
      exames: Prisma.JsonValue
      evolucao: Prisma.JsonValue
      /**
       * *
       *    * Informações ocultas durante a investigação.
       */
      diagnosticoFinal: string
      explicacaoDiagnostico: string
      diagnosticosDiferenciais: Prisma.JsonValue
      pontosChave: Prisma.JsonValue
      /**
       * *
       *    * Configurações do caso.
       */
      publicado: boolean
      geradoPorIA: boolean
      createdAt: Date
      updatedAt: Date
      autorId: number
    }, ExtArgs["result"]["casoClinico"]>
    composites: {}
  }

  type CasoClinicoGetPayload<S extends boolean | null | undefined | CasoClinicoDefaultArgs> = $Result.GetResult<Prisma.$CasoClinicoPayload, S>

  type CasoClinicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CasoClinicoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CasoClinicoCountAggregateInputType | true
    }

  export interface CasoClinicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CasoClinico'], meta: { name: 'CasoClinico' } }
    /**
     * Find zero or one CasoClinico that matches the filter.
     * @param {CasoClinicoFindUniqueArgs} args - Arguments to find a CasoClinico
     * @example
     * // Get one CasoClinico
     * const casoClinico = await prisma.casoClinico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CasoClinicoFindUniqueArgs>(args: SelectSubset<T, CasoClinicoFindUniqueArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CasoClinico that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CasoClinicoFindUniqueOrThrowArgs} args - Arguments to find a CasoClinico
     * @example
     * // Get one CasoClinico
     * const casoClinico = await prisma.casoClinico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CasoClinicoFindUniqueOrThrowArgs>(args: SelectSubset<T, CasoClinicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CasoClinico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoFindFirstArgs} args - Arguments to find a CasoClinico
     * @example
     * // Get one CasoClinico
     * const casoClinico = await prisma.casoClinico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CasoClinicoFindFirstArgs>(args?: SelectSubset<T, CasoClinicoFindFirstArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CasoClinico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoFindFirstOrThrowArgs} args - Arguments to find a CasoClinico
     * @example
     * // Get one CasoClinico
     * const casoClinico = await prisma.casoClinico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CasoClinicoFindFirstOrThrowArgs>(args?: SelectSubset<T, CasoClinicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CasoClinicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CasoClinicos
     * const casoClinicos = await prisma.casoClinico.findMany()
     * 
     * // Get first 10 CasoClinicos
     * const casoClinicos = await prisma.casoClinico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const casoClinicoWithIdOnly = await prisma.casoClinico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CasoClinicoFindManyArgs>(args?: SelectSubset<T, CasoClinicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CasoClinico.
     * @param {CasoClinicoCreateArgs} args - Arguments to create a CasoClinico.
     * @example
     * // Create one CasoClinico
     * const CasoClinico = await prisma.casoClinico.create({
     *   data: {
     *     // ... data to create a CasoClinico
     *   }
     * })
     * 
     */
    create<T extends CasoClinicoCreateArgs>(args: SelectSubset<T, CasoClinicoCreateArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CasoClinicos.
     * @param {CasoClinicoCreateManyArgs} args - Arguments to create many CasoClinicos.
     * @example
     * // Create many CasoClinicos
     * const casoClinico = await prisma.casoClinico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CasoClinicoCreateManyArgs>(args?: SelectSubset<T, CasoClinicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CasoClinicos and returns the data saved in the database.
     * @param {CasoClinicoCreateManyAndReturnArgs} args - Arguments to create many CasoClinicos.
     * @example
     * // Create many CasoClinicos
     * const casoClinico = await prisma.casoClinico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CasoClinicos and only return the `id`
     * const casoClinicoWithIdOnly = await prisma.casoClinico.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CasoClinicoCreateManyAndReturnArgs>(args?: SelectSubset<T, CasoClinicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CasoClinico.
     * @param {CasoClinicoDeleteArgs} args - Arguments to delete one CasoClinico.
     * @example
     * // Delete one CasoClinico
     * const CasoClinico = await prisma.casoClinico.delete({
     *   where: {
     *     // ... filter to delete one CasoClinico
     *   }
     * })
     * 
     */
    delete<T extends CasoClinicoDeleteArgs>(args: SelectSubset<T, CasoClinicoDeleteArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CasoClinico.
     * @param {CasoClinicoUpdateArgs} args - Arguments to update one CasoClinico.
     * @example
     * // Update one CasoClinico
     * const casoClinico = await prisma.casoClinico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CasoClinicoUpdateArgs>(args: SelectSubset<T, CasoClinicoUpdateArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CasoClinicos.
     * @param {CasoClinicoDeleteManyArgs} args - Arguments to filter CasoClinicos to delete.
     * @example
     * // Delete a few CasoClinicos
     * const { count } = await prisma.casoClinico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CasoClinicoDeleteManyArgs>(args?: SelectSubset<T, CasoClinicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CasoClinicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CasoClinicos
     * const casoClinico = await prisma.casoClinico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CasoClinicoUpdateManyArgs>(args: SelectSubset<T, CasoClinicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CasoClinicos and returns the data updated in the database.
     * @param {CasoClinicoUpdateManyAndReturnArgs} args - Arguments to update many CasoClinicos.
     * @example
     * // Update many CasoClinicos
     * const casoClinico = await prisma.casoClinico.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CasoClinicos and only return the `id`
     * const casoClinicoWithIdOnly = await prisma.casoClinico.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CasoClinicoUpdateManyAndReturnArgs>(args: SelectSubset<T, CasoClinicoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CasoClinico.
     * @param {CasoClinicoUpsertArgs} args - Arguments to update or create a CasoClinico.
     * @example
     * // Update or create a CasoClinico
     * const casoClinico = await prisma.casoClinico.upsert({
     *   create: {
     *     // ... data to create a CasoClinico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CasoClinico we want to update
     *   }
     * })
     */
    upsert<T extends CasoClinicoUpsertArgs>(args: SelectSubset<T, CasoClinicoUpsertArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CasoClinicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoCountArgs} args - Arguments to filter CasoClinicos to count.
     * @example
     * // Count the number of CasoClinicos
     * const count = await prisma.casoClinico.count({
     *   where: {
     *     // ... the filter for the CasoClinicos we want to count
     *   }
     * })
    **/
    count<T extends CasoClinicoCountArgs>(
      args?: Subset<T, CasoClinicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CasoClinicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CasoClinico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CasoClinicoAggregateArgs>(args: Subset<T, CasoClinicoAggregateArgs>): Prisma.PrismaPromise<GetCasoClinicoAggregateType<T>>

    /**
     * Group by CasoClinico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasoClinicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CasoClinicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CasoClinicoGroupByArgs['orderBy'] }
        : { orderBy?: CasoClinicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CasoClinicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCasoClinicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CasoClinico model
   */
  readonly fields: CasoClinicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CasoClinico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CasoClinicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    autor<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    investigacoes<T extends CasoClinico$investigacoesArgs<ExtArgs> = {}>(args?: Subset<T, CasoClinico$investigacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    examesCaso<T extends CasoClinico$examesCasoArgs<ExtArgs> = {}>(args?: Subset<T, CasoClinico$examesCasoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CasoClinico model
   */
  interface CasoClinicoFieldRefs {
    readonly id: FieldRef<"CasoClinico", 'Int'>
    readonly titulo: FieldRef<"CasoClinico", 'String'>
    readonly area: FieldRef<"CasoClinico", 'String'>
    readonly especialidade: FieldRef<"CasoClinico", 'String'>
    readonly dificuldade: FieldRef<"CasoClinico", 'String'>
    readonly cenario: FieldRef<"CasoClinico", 'String'>
    readonly queixaInicial: FieldRef<"CasoClinico", 'String'>
    readonly dadosIniciais: FieldRef<"CasoClinico", 'Json'>
    readonly anamnese: FieldRef<"CasoClinico", 'Json'>
    readonly exameFisico: FieldRef<"CasoClinico", 'Json'>
    readonly sinaisVitais: FieldRef<"CasoClinico", 'Json'>
    readonly exames: FieldRef<"CasoClinico", 'Json'>
    readonly evolucao: FieldRef<"CasoClinico", 'Json'>
    readonly diagnosticoFinal: FieldRef<"CasoClinico", 'String'>
    readonly explicacaoDiagnostico: FieldRef<"CasoClinico", 'String'>
    readonly diagnosticosDiferenciais: FieldRef<"CasoClinico", 'Json'>
    readonly pontosChave: FieldRef<"CasoClinico", 'Json'>
    readonly publicado: FieldRef<"CasoClinico", 'Boolean'>
    readonly geradoPorIA: FieldRef<"CasoClinico", 'Boolean'>
    readonly createdAt: FieldRef<"CasoClinico", 'DateTime'>
    readonly updatedAt: FieldRef<"CasoClinico", 'DateTime'>
    readonly autorId: FieldRef<"CasoClinico", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CasoClinico findUnique
   */
  export type CasoClinicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter, which CasoClinico to fetch.
     */
    where: CasoClinicoWhereUniqueInput
  }

  /**
   * CasoClinico findUniqueOrThrow
   */
  export type CasoClinicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter, which CasoClinico to fetch.
     */
    where: CasoClinicoWhereUniqueInput
  }

  /**
   * CasoClinico findFirst
   */
  export type CasoClinicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter, which CasoClinico to fetch.
     */
    where?: CasoClinicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasoClinicos to fetch.
     */
    orderBy?: CasoClinicoOrderByWithRelationInput | CasoClinicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CasoClinicos.
     */
    cursor?: CasoClinicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasoClinicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasoClinicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CasoClinicos.
     */
    distinct?: CasoClinicoScalarFieldEnum | CasoClinicoScalarFieldEnum[]
  }

  /**
   * CasoClinico findFirstOrThrow
   */
  export type CasoClinicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter, which CasoClinico to fetch.
     */
    where?: CasoClinicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasoClinicos to fetch.
     */
    orderBy?: CasoClinicoOrderByWithRelationInput | CasoClinicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CasoClinicos.
     */
    cursor?: CasoClinicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasoClinicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasoClinicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CasoClinicos.
     */
    distinct?: CasoClinicoScalarFieldEnum | CasoClinicoScalarFieldEnum[]
  }

  /**
   * CasoClinico findMany
   */
  export type CasoClinicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter, which CasoClinicos to fetch.
     */
    where?: CasoClinicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasoClinicos to fetch.
     */
    orderBy?: CasoClinicoOrderByWithRelationInput | CasoClinicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CasoClinicos.
     */
    cursor?: CasoClinicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasoClinicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasoClinicos.
     */
    skip?: number
    distinct?: CasoClinicoScalarFieldEnum | CasoClinicoScalarFieldEnum[]
  }

  /**
   * CasoClinico create
   */
  export type CasoClinicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * The data needed to create a CasoClinico.
     */
    data: XOR<CasoClinicoCreateInput, CasoClinicoUncheckedCreateInput>
  }

  /**
   * CasoClinico createMany
   */
  export type CasoClinicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CasoClinicos.
     */
    data: CasoClinicoCreateManyInput | CasoClinicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CasoClinico createManyAndReturn
   */
  export type CasoClinicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * The data used to create many CasoClinicos.
     */
    data: CasoClinicoCreateManyInput | CasoClinicoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CasoClinico update
   */
  export type CasoClinicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * The data needed to update a CasoClinico.
     */
    data: XOR<CasoClinicoUpdateInput, CasoClinicoUncheckedUpdateInput>
    /**
     * Choose, which CasoClinico to update.
     */
    where: CasoClinicoWhereUniqueInput
  }

  /**
   * CasoClinico updateMany
   */
  export type CasoClinicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CasoClinicos.
     */
    data: XOR<CasoClinicoUpdateManyMutationInput, CasoClinicoUncheckedUpdateManyInput>
    /**
     * Filter which CasoClinicos to update
     */
    where?: CasoClinicoWhereInput
    /**
     * Limit how many CasoClinicos to update.
     */
    limit?: number
  }

  /**
   * CasoClinico updateManyAndReturn
   */
  export type CasoClinicoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * The data used to update CasoClinicos.
     */
    data: XOR<CasoClinicoUpdateManyMutationInput, CasoClinicoUncheckedUpdateManyInput>
    /**
     * Filter which CasoClinicos to update
     */
    where?: CasoClinicoWhereInput
    /**
     * Limit how many CasoClinicos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CasoClinico upsert
   */
  export type CasoClinicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * The filter to search for the CasoClinico to update in case it exists.
     */
    where: CasoClinicoWhereUniqueInput
    /**
     * In case the CasoClinico found by the `where` argument doesn't exist, create a new CasoClinico with this data.
     */
    create: XOR<CasoClinicoCreateInput, CasoClinicoUncheckedCreateInput>
    /**
     * In case the CasoClinico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CasoClinicoUpdateInput, CasoClinicoUncheckedUpdateInput>
  }

  /**
   * CasoClinico delete
   */
  export type CasoClinicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
    /**
     * Filter which CasoClinico to delete.
     */
    where: CasoClinicoWhereUniqueInput
  }

  /**
   * CasoClinico deleteMany
   */
  export type CasoClinicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CasoClinicos to delete
     */
    where?: CasoClinicoWhereInput
    /**
     * Limit how many CasoClinicos to delete.
     */
    limit?: number
  }

  /**
   * CasoClinico.investigacoes
   */
  export type CasoClinico$investigacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    where?: InvestigacaoCasoWhereInput
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    cursor?: InvestigacaoCasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvestigacaoCasoScalarFieldEnum | InvestigacaoCasoScalarFieldEnum[]
  }

  /**
   * CasoClinico.examesCaso
   */
  export type CasoClinico$examesCasoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    where?: ExameCasoWhereInput
    orderBy?: ExameCasoOrderByWithRelationInput | ExameCasoOrderByWithRelationInput[]
    cursor?: ExameCasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExameCasoScalarFieldEnum | ExameCasoScalarFieldEnum[]
  }

  /**
   * CasoClinico without action
   */
  export type CasoClinicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasoClinico
     */
    select?: CasoClinicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasoClinico
     */
    omit?: CasoClinicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CasoClinicoInclude<ExtArgs> | null
  }


  /**
   * Model ExameCaso
   */

  export type AggregateExameCaso = {
    _count: ExameCasoCountAggregateOutputType | null
    _avg: ExameCasoAvgAggregateOutputType | null
    _sum: ExameCasoSumAggregateOutputType | null
    _min: ExameCasoMinAggregateOutputType | null
    _max: ExameCasoMaxAggregateOutputType | null
  }

  export type ExameCasoAvgAggregateOutputType = {
    id: number | null
    casoId: number | null
    ordem: number | null
  }

  export type ExameCasoSumAggregateOutputType = {
    id: number | null
    casoId: number | null
    ordem: number | null
  }

  export type ExameCasoMinAggregateOutputType = {
    id: number | null
    casoId: number | null
    nome: string | null
    categoria: string | null
    resultado: string | null
    interpretacao: string | null
    disponivel: boolean | null
    ordem: number | null
    createdAt: Date | null
  }

  export type ExameCasoMaxAggregateOutputType = {
    id: number | null
    casoId: number | null
    nome: string | null
    categoria: string | null
    resultado: string | null
    interpretacao: string | null
    disponivel: boolean | null
    ordem: number | null
    createdAt: Date | null
  }

  export type ExameCasoCountAggregateOutputType = {
    id: number
    casoId: number
    nome: number
    categoria: number
    resultado: number
    interpretacao: number
    disponivel: number
    ordem: number
    createdAt: number
    _all: number
  }


  export type ExameCasoAvgAggregateInputType = {
    id?: true
    casoId?: true
    ordem?: true
  }

  export type ExameCasoSumAggregateInputType = {
    id?: true
    casoId?: true
    ordem?: true
  }

  export type ExameCasoMinAggregateInputType = {
    id?: true
    casoId?: true
    nome?: true
    categoria?: true
    resultado?: true
    interpretacao?: true
    disponivel?: true
    ordem?: true
    createdAt?: true
  }

  export type ExameCasoMaxAggregateInputType = {
    id?: true
    casoId?: true
    nome?: true
    categoria?: true
    resultado?: true
    interpretacao?: true
    disponivel?: true
    ordem?: true
    createdAt?: true
  }

  export type ExameCasoCountAggregateInputType = {
    id?: true
    casoId?: true
    nome?: true
    categoria?: true
    resultado?: true
    interpretacao?: true
    disponivel?: true
    ordem?: true
    createdAt?: true
    _all?: true
  }

  export type ExameCasoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExameCaso to aggregate.
     */
    where?: ExameCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExameCasos to fetch.
     */
    orderBy?: ExameCasoOrderByWithRelationInput | ExameCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExameCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExameCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExameCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExameCasos
    **/
    _count?: true | ExameCasoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExameCasoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExameCasoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExameCasoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExameCasoMaxAggregateInputType
  }

  export type GetExameCasoAggregateType<T extends ExameCasoAggregateArgs> = {
        [P in keyof T & keyof AggregateExameCaso]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExameCaso[P]>
      : GetScalarType<T[P], AggregateExameCaso[P]>
  }




  export type ExameCasoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExameCasoWhereInput
    orderBy?: ExameCasoOrderByWithAggregationInput | ExameCasoOrderByWithAggregationInput[]
    by: ExameCasoScalarFieldEnum[] | ExameCasoScalarFieldEnum
    having?: ExameCasoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExameCasoCountAggregateInputType | true
    _avg?: ExameCasoAvgAggregateInputType
    _sum?: ExameCasoSumAggregateInputType
    _min?: ExameCasoMinAggregateInputType
    _max?: ExameCasoMaxAggregateInputType
  }

  export type ExameCasoGroupByOutputType = {
    id: number
    casoId: number
    nome: string
    categoria: string | null
    resultado: string
    interpretacao: string | null
    disponivel: boolean
    ordem: number
    createdAt: Date
    _count: ExameCasoCountAggregateOutputType | null
    _avg: ExameCasoAvgAggregateOutputType | null
    _sum: ExameCasoSumAggregateOutputType | null
    _min: ExameCasoMinAggregateOutputType | null
    _max: ExameCasoMaxAggregateOutputType | null
  }

  type GetExameCasoGroupByPayload<T extends ExameCasoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExameCasoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExameCasoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExameCasoGroupByOutputType[P]>
            : GetScalarType<T[P], ExameCasoGroupByOutputType[P]>
        }
      >
    >


  export type ExameCasoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    nome?: boolean
    categoria?: boolean
    resultado?: boolean
    interpretacao?: boolean
    disponivel?: boolean
    ordem?: boolean
    createdAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exameCaso"]>

  export type ExameCasoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    nome?: boolean
    categoria?: boolean
    resultado?: boolean
    interpretacao?: boolean
    disponivel?: boolean
    ordem?: boolean
    createdAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exameCaso"]>

  export type ExameCasoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    nome?: boolean
    categoria?: boolean
    resultado?: boolean
    interpretacao?: boolean
    disponivel?: boolean
    ordem?: boolean
    createdAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exameCaso"]>

  export type ExameCasoSelectScalar = {
    id?: boolean
    casoId?: boolean
    nome?: boolean
    categoria?: boolean
    resultado?: boolean
    interpretacao?: boolean
    disponivel?: boolean
    ordem?: boolean
    createdAt?: boolean
  }

  export type ExameCasoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "casoId" | "nome" | "categoria" | "resultado" | "interpretacao" | "disponivel" | "ordem" | "createdAt", ExtArgs["result"]["exameCaso"]>
  export type ExameCasoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }
  export type ExameCasoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }
  export type ExameCasoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
  }

  export type $ExameCasoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExameCaso"
    objects: {
      caso: Prisma.$CasoClinicoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      casoId: number
      /**
       * *
       *    * Exemplo:
       *    * Hemograma
       *    * Gasometria arterial
       *    * ECG
       *    * Radiografia de tórax
       *    * Troponina
       */
      nome: string
      categoria: string | null
      /**
       * *
       *    * O que o exame realmente mostrou.
       *    * Fica no banco e NÃO é enviado antes de ser solicitado.
       */
      resultado: string
      interpretacao: string | null
      /**
       * *
       *    * Ajuda o sistema a organizar a investigação.
       */
      disponivel: boolean
      ordem: number
      createdAt: Date
    }, ExtArgs["result"]["exameCaso"]>
    composites: {}
  }

  type ExameCasoGetPayload<S extends boolean | null | undefined | ExameCasoDefaultArgs> = $Result.GetResult<Prisma.$ExameCasoPayload, S>

  type ExameCasoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExameCasoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExameCasoCountAggregateInputType | true
    }

  export interface ExameCasoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExameCaso'], meta: { name: 'ExameCaso' } }
    /**
     * Find zero or one ExameCaso that matches the filter.
     * @param {ExameCasoFindUniqueArgs} args - Arguments to find a ExameCaso
     * @example
     * // Get one ExameCaso
     * const exameCaso = await prisma.exameCaso.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExameCasoFindUniqueArgs>(args: SelectSubset<T, ExameCasoFindUniqueArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExameCaso that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExameCasoFindUniqueOrThrowArgs} args - Arguments to find a ExameCaso
     * @example
     * // Get one ExameCaso
     * const exameCaso = await prisma.exameCaso.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExameCasoFindUniqueOrThrowArgs>(args: SelectSubset<T, ExameCasoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExameCaso that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoFindFirstArgs} args - Arguments to find a ExameCaso
     * @example
     * // Get one ExameCaso
     * const exameCaso = await prisma.exameCaso.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExameCasoFindFirstArgs>(args?: SelectSubset<T, ExameCasoFindFirstArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExameCaso that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoFindFirstOrThrowArgs} args - Arguments to find a ExameCaso
     * @example
     * // Get one ExameCaso
     * const exameCaso = await prisma.exameCaso.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExameCasoFindFirstOrThrowArgs>(args?: SelectSubset<T, ExameCasoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExameCasos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExameCasos
     * const exameCasos = await prisma.exameCaso.findMany()
     * 
     * // Get first 10 ExameCasos
     * const exameCasos = await prisma.exameCaso.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exameCasoWithIdOnly = await prisma.exameCaso.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExameCasoFindManyArgs>(args?: SelectSubset<T, ExameCasoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExameCaso.
     * @param {ExameCasoCreateArgs} args - Arguments to create a ExameCaso.
     * @example
     * // Create one ExameCaso
     * const ExameCaso = await prisma.exameCaso.create({
     *   data: {
     *     // ... data to create a ExameCaso
     *   }
     * })
     * 
     */
    create<T extends ExameCasoCreateArgs>(args: SelectSubset<T, ExameCasoCreateArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExameCasos.
     * @param {ExameCasoCreateManyArgs} args - Arguments to create many ExameCasos.
     * @example
     * // Create many ExameCasos
     * const exameCaso = await prisma.exameCaso.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExameCasoCreateManyArgs>(args?: SelectSubset<T, ExameCasoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExameCasos and returns the data saved in the database.
     * @param {ExameCasoCreateManyAndReturnArgs} args - Arguments to create many ExameCasos.
     * @example
     * // Create many ExameCasos
     * const exameCaso = await prisma.exameCaso.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExameCasos and only return the `id`
     * const exameCasoWithIdOnly = await prisma.exameCaso.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExameCasoCreateManyAndReturnArgs>(args?: SelectSubset<T, ExameCasoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExameCaso.
     * @param {ExameCasoDeleteArgs} args - Arguments to delete one ExameCaso.
     * @example
     * // Delete one ExameCaso
     * const ExameCaso = await prisma.exameCaso.delete({
     *   where: {
     *     // ... filter to delete one ExameCaso
     *   }
     * })
     * 
     */
    delete<T extends ExameCasoDeleteArgs>(args: SelectSubset<T, ExameCasoDeleteArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExameCaso.
     * @param {ExameCasoUpdateArgs} args - Arguments to update one ExameCaso.
     * @example
     * // Update one ExameCaso
     * const exameCaso = await prisma.exameCaso.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExameCasoUpdateArgs>(args: SelectSubset<T, ExameCasoUpdateArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExameCasos.
     * @param {ExameCasoDeleteManyArgs} args - Arguments to filter ExameCasos to delete.
     * @example
     * // Delete a few ExameCasos
     * const { count } = await prisma.exameCaso.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExameCasoDeleteManyArgs>(args?: SelectSubset<T, ExameCasoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExameCasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExameCasos
     * const exameCaso = await prisma.exameCaso.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExameCasoUpdateManyArgs>(args: SelectSubset<T, ExameCasoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExameCasos and returns the data updated in the database.
     * @param {ExameCasoUpdateManyAndReturnArgs} args - Arguments to update many ExameCasos.
     * @example
     * // Update many ExameCasos
     * const exameCaso = await prisma.exameCaso.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExameCasos and only return the `id`
     * const exameCasoWithIdOnly = await prisma.exameCaso.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExameCasoUpdateManyAndReturnArgs>(args: SelectSubset<T, ExameCasoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExameCaso.
     * @param {ExameCasoUpsertArgs} args - Arguments to update or create a ExameCaso.
     * @example
     * // Update or create a ExameCaso
     * const exameCaso = await prisma.exameCaso.upsert({
     *   create: {
     *     // ... data to create a ExameCaso
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExameCaso we want to update
     *   }
     * })
     */
    upsert<T extends ExameCasoUpsertArgs>(args: SelectSubset<T, ExameCasoUpsertArgs<ExtArgs>>): Prisma__ExameCasoClient<$Result.GetResult<Prisma.$ExameCasoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExameCasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoCountArgs} args - Arguments to filter ExameCasos to count.
     * @example
     * // Count the number of ExameCasos
     * const count = await prisma.exameCaso.count({
     *   where: {
     *     // ... the filter for the ExameCasos we want to count
     *   }
     * })
    **/
    count<T extends ExameCasoCountArgs>(
      args?: Subset<T, ExameCasoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExameCasoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExameCaso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExameCasoAggregateArgs>(args: Subset<T, ExameCasoAggregateArgs>): Prisma.PrismaPromise<GetExameCasoAggregateType<T>>

    /**
     * Group by ExameCaso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExameCasoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExameCasoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExameCasoGroupByArgs['orderBy'] }
        : { orderBy?: ExameCasoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExameCasoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExameCasoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExameCaso model
   */
  readonly fields: ExameCasoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExameCaso.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExameCasoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    caso<T extends CasoClinicoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CasoClinicoDefaultArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExameCaso model
   */
  interface ExameCasoFieldRefs {
    readonly id: FieldRef<"ExameCaso", 'Int'>
    readonly casoId: FieldRef<"ExameCaso", 'Int'>
    readonly nome: FieldRef<"ExameCaso", 'String'>
    readonly categoria: FieldRef<"ExameCaso", 'String'>
    readonly resultado: FieldRef<"ExameCaso", 'String'>
    readonly interpretacao: FieldRef<"ExameCaso", 'String'>
    readonly disponivel: FieldRef<"ExameCaso", 'Boolean'>
    readonly ordem: FieldRef<"ExameCaso", 'Int'>
    readonly createdAt: FieldRef<"ExameCaso", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExameCaso findUnique
   */
  export type ExameCasoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter, which ExameCaso to fetch.
     */
    where: ExameCasoWhereUniqueInput
  }

  /**
   * ExameCaso findUniqueOrThrow
   */
  export type ExameCasoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter, which ExameCaso to fetch.
     */
    where: ExameCasoWhereUniqueInput
  }

  /**
   * ExameCaso findFirst
   */
  export type ExameCasoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter, which ExameCaso to fetch.
     */
    where?: ExameCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExameCasos to fetch.
     */
    orderBy?: ExameCasoOrderByWithRelationInput | ExameCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExameCasos.
     */
    cursor?: ExameCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExameCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExameCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExameCasos.
     */
    distinct?: ExameCasoScalarFieldEnum | ExameCasoScalarFieldEnum[]
  }

  /**
   * ExameCaso findFirstOrThrow
   */
  export type ExameCasoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter, which ExameCaso to fetch.
     */
    where?: ExameCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExameCasos to fetch.
     */
    orderBy?: ExameCasoOrderByWithRelationInput | ExameCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExameCasos.
     */
    cursor?: ExameCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExameCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExameCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExameCasos.
     */
    distinct?: ExameCasoScalarFieldEnum | ExameCasoScalarFieldEnum[]
  }

  /**
   * ExameCaso findMany
   */
  export type ExameCasoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter, which ExameCasos to fetch.
     */
    where?: ExameCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExameCasos to fetch.
     */
    orderBy?: ExameCasoOrderByWithRelationInput | ExameCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExameCasos.
     */
    cursor?: ExameCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExameCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExameCasos.
     */
    skip?: number
    distinct?: ExameCasoScalarFieldEnum | ExameCasoScalarFieldEnum[]
  }

  /**
   * ExameCaso create
   */
  export type ExameCasoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * The data needed to create a ExameCaso.
     */
    data: XOR<ExameCasoCreateInput, ExameCasoUncheckedCreateInput>
  }

  /**
   * ExameCaso createMany
   */
  export type ExameCasoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExameCasos.
     */
    data: ExameCasoCreateManyInput | ExameCasoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExameCaso createManyAndReturn
   */
  export type ExameCasoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * The data used to create many ExameCasos.
     */
    data: ExameCasoCreateManyInput | ExameCasoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExameCaso update
   */
  export type ExameCasoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * The data needed to update a ExameCaso.
     */
    data: XOR<ExameCasoUpdateInput, ExameCasoUncheckedUpdateInput>
    /**
     * Choose, which ExameCaso to update.
     */
    where: ExameCasoWhereUniqueInput
  }

  /**
   * ExameCaso updateMany
   */
  export type ExameCasoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExameCasos.
     */
    data: XOR<ExameCasoUpdateManyMutationInput, ExameCasoUncheckedUpdateManyInput>
    /**
     * Filter which ExameCasos to update
     */
    where?: ExameCasoWhereInput
    /**
     * Limit how many ExameCasos to update.
     */
    limit?: number
  }

  /**
   * ExameCaso updateManyAndReturn
   */
  export type ExameCasoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * The data used to update ExameCasos.
     */
    data: XOR<ExameCasoUpdateManyMutationInput, ExameCasoUncheckedUpdateManyInput>
    /**
     * Filter which ExameCasos to update
     */
    where?: ExameCasoWhereInput
    /**
     * Limit how many ExameCasos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExameCaso upsert
   */
  export type ExameCasoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * The filter to search for the ExameCaso to update in case it exists.
     */
    where: ExameCasoWhereUniqueInput
    /**
     * In case the ExameCaso found by the `where` argument doesn't exist, create a new ExameCaso with this data.
     */
    create: XOR<ExameCasoCreateInput, ExameCasoUncheckedCreateInput>
    /**
     * In case the ExameCaso was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExameCasoUpdateInput, ExameCasoUncheckedUpdateInput>
  }

  /**
   * ExameCaso delete
   */
  export type ExameCasoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
    /**
     * Filter which ExameCaso to delete.
     */
    where: ExameCasoWhereUniqueInput
  }

  /**
   * ExameCaso deleteMany
   */
  export type ExameCasoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExameCasos to delete
     */
    where?: ExameCasoWhereInput
    /**
     * Limit how many ExameCasos to delete.
     */
    limit?: number
  }

  /**
   * ExameCaso without action
   */
  export type ExameCasoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExameCaso
     */
    select?: ExameCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExameCaso
     */
    omit?: ExameCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExameCasoInclude<ExtArgs> | null
  }


  /**
   * Model InvestigacaoCaso
   */

  export type AggregateInvestigacaoCaso = {
    _count: InvestigacaoCasoCountAggregateOutputType | null
    _avg: InvestigacaoCasoAvgAggregateOutputType | null
    _sum: InvestigacaoCasoSumAggregateOutputType | null
    _min: InvestigacaoCasoMinAggregateOutputType | null
    _max: InvestigacaoCasoMaxAggregateOutputType | null
  }

  export type InvestigacaoCasoAvgAggregateOutputType = {
    id: number | null
    casoId: number | null
    usuarioId: number | null
  }

  export type InvestigacaoCasoSumAggregateOutputType = {
    id: number | null
    casoId: number | null
    usuarioId: number | null
  }

  export type InvestigacaoCasoMinAggregateOutputType = {
    id: number | null
    casoId: number | null
    usuarioId: number | null
    status: string | null
    hipotese: string | null
    justificativa: string | null
    finalizado: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigacaoCasoMaxAggregateOutputType = {
    id: number | null
    casoId: number | null
    usuarioId: number | null
    status: string | null
    hipotese: string | null
    justificativa: string | null
    finalizado: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvestigacaoCasoCountAggregateOutputType = {
    id: number
    casoId: number
    usuarioId: number
    status: number
    informacoesColetadas: number
    hipotese: number
    justificativa: number
    avaliacao: number
    finalizado: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvestigacaoCasoAvgAggregateInputType = {
    id?: true
    casoId?: true
    usuarioId?: true
  }

  export type InvestigacaoCasoSumAggregateInputType = {
    id?: true
    casoId?: true
    usuarioId?: true
  }

  export type InvestigacaoCasoMinAggregateInputType = {
    id?: true
    casoId?: true
    usuarioId?: true
    status?: true
    hipotese?: true
    justificativa?: true
    finalizado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigacaoCasoMaxAggregateInputType = {
    id?: true
    casoId?: true
    usuarioId?: true
    status?: true
    hipotese?: true
    justificativa?: true
    finalizado?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvestigacaoCasoCountAggregateInputType = {
    id?: true
    casoId?: true
    usuarioId?: true
    status?: true
    informacoesColetadas?: true
    hipotese?: true
    justificativa?: true
    avaliacao?: true
    finalizado?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvestigacaoCasoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigacaoCaso to aggregate.
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigacaoCasos to fetch.
     */
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvestigacaoCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigacaoCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigacaoCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvestigacaoCasos
    **/
    _count?: true | InvestigacaoCasoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvestigacaoCasoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvestigacaoCasoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvestigacaoCasoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvestigacaoCasoMaxAggregateInputType
  }

  export type GetInvestigacaoCasoAggregateType<T extends InvestigacaoCasoAggregateArgs> = {
        [P in keyof T & keyof AggregateInvestigacaoCaso]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvestigacaoCaso[P]>
      : GetScalarType<T[P], AggregateInvestigacaoCaso[P]>
  }




  export type InvestigacaoCasoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvestigacaoCasoWhereInput
    orderBy?: InvestigacaoCasoOrderByWithAggregationInput | InvestigacaoCasoOrderByWithAggregationInput[]
    by: InvestigacaoCasoScalarFieldEnum[] | InvestigacaoCasoScalarFieldEnum
    having?: InvestigacaoCasoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvestigacaoCasoCountAggregateInputType | true
    _avg?: InvestigacaoCasoAvgAggregateInputType
    _sum?: InvestigacaoCasoSumAggregateInputType
    _min?: InvestigacaoCasoMinAggregateInputType
    _max?: InvestigacaoCasoMaxAggregateInputType
  }

  export type InvestigacaoCasoGroupByOutputType = {
    id: number
    casoId: number
    usuarioId: number
    status: string
    informacoesColetadas: JsonValue
    hipotese: string | null
    justificativa: string | null
    avaliacao: JsonValue | null
    finalizado: boolean
    createdAt: Date
    updatedAt: Date
    _count: InvestigacaoCasoCountAggregateOutputType | null
    _avg: InvestigacaoCasoAvgAggregateOutputType | null
    _sum: InvestigacaoCasoSumAggregateOutputType | null
    _min: InvestigacaoCasoMinAggregateOutputType | null
    _max: InvestigacaoCasoMaxAggregateOutputType | null
  }

  type GetInvestigacaoCasoGroupByPayload<T extends InvestigacaoCasoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvestigacaoCasoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvestigacaoCasoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvestigacaoCasoGroupByOutputType[P]>
            : GetScalarType<T[P], InvestigacaoCasoGroupByOutputType[P]>
        }
      >
    >


  export type InvestigacaoCasoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    usuarioId?: boolean
    status?: boolean
    informacoesColetadas?: boolean
    hipotese?: boolean
    justificativa?: boolean
    avaliacao?: boolean
    finalizado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    registros?: boolean | InvestigacaoCaso$registrosArgs<ExtArgs>
    _count?: boolean | InvestigacaoCasoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigacaoCaso"]>

  export type InvestigacaoCasoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    usuarioId?: boolean
    status?: boolean
    informacoesColetadas?: boolean
    hipotese?: boolean
    justificativa?: boolean
    avaliacao?: boolean
    finalizado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigacaoCaso"]>

  export type InvestigacaoCasoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    casoId?: boolean
    usuarioId?: boolean
    status?: boolean
    informacoesColetadas?: boolean
    hipotese?: boolean
    justificativa?: boolean
    avaliacao?: boolean
    finalizado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["investigacaoCaso"]>

  export type InvestigacaoCasoSelectScalar = {
    id?: boolean
    casoId?: boolean
    usuarioId?: boolean
    status?: boolean
    informacoesColetadas?: boolean
    hipotese?: boolean
    justificativa?: boolean
    avaliacao?: boolean
    finalizado?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvestigacaoCasoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "casoId" | "usuarioId" | "status" | "informacoesColetadas" | "hipotese" | "justificativa" | "avaliacao" | "finalizado" | "createdAt" | "updatedAt", ExtArgs["result"]["investigacaoCaso"]>
  export type InvestigacaoCasoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
    registros?: boolean | InvestigacaoCaso$registrosArgs<ExtArgs>
    _count?: boolean | InvestigacaoCasoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvestigacaoCasoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type InvestigacaoCasoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    caso?: boolean | CasoClinicoDefaultArgs<ExtArgs>
    usuario?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $InvestigacaoCasoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvestigacaoCaso"
    objects: {
      caso: Prisma.$CasoClinicoPayload<ExtArgs>
      usuario: Prisma.$UsuarioPayload<ExtArgs>
      registros: Prisma.$RegistroInvestigacaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      casoId: number
      usuarioId: number
      /**
       * *
       *    * EM_ANDAMENTO
       *    * FINALIZADA
       */
      status: string
      /**
       * *
       *    * Guarda tudo que o aluno já descobriu.
       */
      informacoesColetadas: Prisma.JsonValue
      /**
       * *
       *    * Hipótese diagnóstica enviada pelo aluno.
       */
      hipotese: string | null
      /**
       * *
       *    * Raciocínio utilizado pelo aluno.
       */
      justificativa: string | null
      /**
       * *
       *    * Avaliação feita pelo sistema depois
       *    * da hipótese final.
       */
      avaliacao: Prisma.JsonValue | null
      finalizado: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["investigacaoCaso"]>
    composites: {}
  }

  type InvestigacaoCasoGetPayload<S extends boolean | null | undefined | InvestigacaoCasoDefaultArgs> = $Result.GetResult<Prisma.$InvestigacaoCasoPayload, S>

  type InvestigacaoCasoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvestigacaoCasoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvestigacaoCasoCountAggregateInputType | true
    }

  export interface InvestigacaoCasoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvestigacaoCaso'], meta: { name: 'InvestigacaoCaso' } }
    /**
     * Find zero or one InvestigacaoCaso that matches the filter.
     * @param {InvestigacaoCasoFindUniqueArgs} args - Arguments to find a InvestigacaoCaso
     * @example
     * // Get one InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvestigacaoCasoFindUniqueArgs>(args: SelectSubset<T, InvestigacaoCasoFindUniqueArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvestigacaoCaso that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvestigacaoCasoFindUniqueOrThrowArgs} args - Arguments to find a InvestigacaoCaso
     * @example
     * // Get one InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvestigacaoCasoFindUniqueOrThrowArgs>(args: SelectSubset<T, InvestigacaoCasoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvestigacaoCaso that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoFindFirstArgs} args - Arguments to find a InvestigacaoCaso
     * @example
     * // Get one InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvestigacaoCasoFindFirstArgs>(args?: SelectSubset<T, InvestigacaoCasoFindFirstArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvestigacaoCaso that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoFindFirstOrThrowArgs} args - Arguments to find a InvestigacaoCaso
     * @example
     * // Get one InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvestigacaoCasoFindFirstOrThrowArgs>(args?: SelectSubset<T, InvestigacaoCasoFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvestigacaoCasos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvestigacaoCasos
     * const investigacaoCasos = await prisma.investigacaoCaso.findMany()
     * 
     * // Get first 10 InvestigacaoCasos
     * const investigacaoCasos = await prisma.investigacaoCaso.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const investigacaoCasoWithIdOnly = await prisma.investigacaoCaso.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvestigacaoCasoFindManyArgs>(args?: SelectSubset<T, InvestigacaoCasoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvestigacaoCaso.
     * @param {InvestigacaoCasoCreateArgs} args - Arguments to create a InvestigacaoCaso.
     * @example
     * // Create one InvestigacaoCaso
     * const InvestigacaoCaso = await prisma.investigacaoCaso.create({
     *   data: {
     *     // ... data to create a InvestigacaoCaso
     *   }
     * })
     * 
     */
    create<T extends InvestigacaoCasoCreateArgs>(args: SelectSubset<T, InvestigacaoCasoCreateArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvestigacaoCasos.
     * @param {InvestigacaoCasoCreateManyArgs} args - Arguments to create many InvestigacaoCasos.
     * @example
     * // Create many InvestigacaoCasos
     * const investigacaoCaso = await prisma.investigacaoCaso.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvestigacaoCasoCreateManyArgs>(args?: SelectSubset<T, InvestigacaoCasoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvestigacaoCasos and returns the data saved in the database.
     * @param {InvestigacaoCasoCreateManyAndReturnArgs} args - Arguments to create many InvestigacaoCasos.
     * @example
     * // Create many InvestigacaoCasos
     * const investigacaoCaso = await prisma.investigacaoCaso.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvestigacaoCasos and only return the `id`
     * const investigacaoCasoWithIdOnly = await prisma.investigacaoCaso.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvestigacaoCasoCreateManyAndReturnArgs>(args?: SelectSubset<T, InvestigacaoCasoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InvestigacaoCaso.
     * @param {InvestigacaoCasoDeleteArgs} args - Arguments to delete one InvestigacaoCaso.
     * @example
     * // Delete one InvestigacaoCaso
     * const InvestigacaoCaso = await prisma.investigacaoCaso.delete({
     *   where: {
     *     // ... filter to delete one InvestigacaoCaso
     *   }
     * })
     * 
     */
    delete<T extends InvestigacaoCasoDeleteArgs>(args: SelectSubset<T, InvestigacaoCasoDeleteArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvestigacaoCaso.
     * @param {InvestigacaoCasoUpdateArgs} args - Arguments to update one InvestigacaoCaso.
     * @example
     * // Update one InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvestigacaoCasoUpdateArgs>(args: SelectSubset<T, InvestigacaoCasoUpdateArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvestigacaoCasos.
     * @param {InvestigacaoCasoDeleteManyArgs} args - Arguments to filter InvestigacaoCasos to delete.
     * @example
     * // Delete a few InvestigacaoCasos
     * const { count } = await prisma.investigacaoCaso.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvestigacaoCasoDeleteManyArgs>(args?: SelectSubset<T, InvestigacaoCasoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvestigacaoCasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvestigacaoCasos
     * const investigacaoCaso = await prisma.investigacaoCaso.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvestigacaoCasoUpdateManyArgs>(args: SelectSubset<T, InvestigacaoCasoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvestigacaoCasos and returns the data updated in the database.
     * @param {InvestigacaoCasoUpdateManyAndReturnArgs} args - Arguments to update many InvestigacaoCasos.
     * @example
     * // Update many InvestigacaoCasos
     * const investigacaoCaso = await prisma.investigacaoCaso.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InvestigacaoCasos and only return the `id`
     * const investigacaoCasoWithIdOnly = await prisma.investigacaoCaso.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvestigacaoCasoUpdateManyAndReturnArgs>(args: SelectSubset<T, InvestigacaoCasoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InvestigacaoCaso.
     * @param {InvestigacaoCasoUpsertArgs} args - Arguments to update or create a InvestigacaoCaso.
     * @example
     * // Update or create a InvestigacaoCaso
     * const investigacaoCaso = await prisma.investigacaoCaso.upsert({
     *   create: {
     *     // ... data to create a InvestigacaoCaso
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvestigacaoCaso we want to update
     *   }
     * })
     */
    upsert<T extends InvestigacaoCasoUpsertArgs>(args: SelectSubset<T, InvestigacaoCasoUpsertArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvestigacaoCasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoCountArgs} args - Arguments to filter InvestigacaoCasos to count.
     * @example
     * // Count the number of InvestigacaoCasos
     * const count = await prisma.investigacaoCaso.count({
     *   where: {
     *     // ... the filter for the InvestigacaoCasos we want to count
     *   }
     * })
    **/
    count<T extends InvestigacaoCasoCountArgs>(
      args?: Subset<T, InvestigacaoCasoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvestigacaoCasoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvestigacaoCaso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvestigacaoCasoAggregateArgs>(args: Subset<T, InvestigacaoCasoAggregateArgs>): Prisma.PrismaPromise<GetInvestigacaoCasoAggregateType<T>>

    /**
     * Group by InvestigacaoCaso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvestigacaoCasoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvestigacaoCasoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvestigacaoCasoGroupByArgs['orderBy'] }
        : { orderBy?: InvestigacaoCasoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvestigacaoCasoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvestigacaoCasoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvestigacaoCaso model
   */
  readonly fields: InvestigacaoCasoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvestigacaoCaso.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvestigacaoCasoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    caso<T extends CasoClinicoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CasoClinicoDefaultArgs<ExtArgs>>): Prisma__CasoClinicoClient<$Result.GetResult<Prisma.$CasoClinicoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usuario<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    registros<T extends InvestigacaoCaso$registrosArgs<ExtArgs> = {}>(args?: Subset<T, InvestigacaoCaso$registrosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvestigacaoCaso model
   */
  interface InvestigacaoCasoFieldRefs {
    readonly id: FieldRef<"InvestigacaoCaso", 'Int'>
    readonly casoId: FieldRef<"InvestigacaoCaso", 'Int'>
    readonly usuarioId: FieldRef<"InvestigacaoCaso", 'Int'>
    readonly status: FieldRef<"InvestigacaoCaso", 'String'>
    readonly informacoesColetadas: FieldRef<"InvestigacaoCaso", 'Json'>
    readonly hipotese: FieldRef<"InvestigacaoCaso", 'String'>
    readonly justificativa: FieldRef<"InvestigacaoCaso", 'String'>
    readonly avaliacao: FieldRef<"InvestigacaoCaso", 'Json'>
    readonly finalizado: FieldRef<"InvestigacaoCaso", 'Boolean'>
    readonly createdAt: FieldRef<"InvestigacaoCaso", 'DateTime'>
    readonly updatedAt: FieldRef<"InvestigacaoCaso", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InvestigacaoCaso findUnique
   */
  export type InvestigacaoCasoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter, which InvestigacaoCaso to fetch.
     */
    where: InvestigacaoCasoWhereUniqueInput
  }

  /**
   * InvestigacaoCaso findUniqueOrThrow
   */
  export type InvestigacaoCasoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter, which InvestigacaoCaso to fetch.
     */
    where: InvestigacaoCasoWhereUniqueInput
  }

  /**
   * InvestigacaoCaso findFirst
   */
  export type InvestigacaoCasoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter, which InvestigacaoCaso to fetch.
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigacaoCasos to fetch.
     */
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigacaoCasos.
     */
    cursor?: InvestigacaoCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigacaoCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigacaoCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigacaoCasos.
     */
    distinct?: InvestigacaoCasoScalarFieldEnum | InvestigacaoCasoScalarFieldEnum[]
  }

  /**
   * InvestigacaoCaso findFirstOrThrow
   */
  export type InvestigacaoCasoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter, which InvestigacaoCaso to fetch.
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigacaoCasos to fetch.
     */
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvestigacaoCasos.
     */
    cursor?: InvestigacaoCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigacaoCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigacaoCasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvestigacaoCasos.
     */
    distinct?: InvestigacaoCasoScalarFieldEnum | InvestigacaoCasoScalarFieldEnum[]
  }

  /**
   * InvestigacaoCaso findMany
   */
  export type InvestigacaoCasoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter, which InvestigacaoCasos to fetch.
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvestigacaoCasos to fetch.
     */
    orderBy?: InvestigacaoCasoOrderByWithRelationInput | InvestigacaoCasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvestigacaoCasos.
     */
    cursor?: InvestigacaoCasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvestigacaoCasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvestigacaoCasos.
     */
    skip?: number
    distinct?: InvestigacaoCasoScalarFieldEnum | InvestigacaoCasoScalarFieldEnum[]
  }

  /**
   * InvestigacaoCaso create
   */
  export type InvestigacaoCasoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * The data needed to create a InvestigacaoCaso.
     */
    data: XOR<InvestigacaoCasoCreateInput, InvestigacaoCasoUncheckedCreateInput>
  }

  /**
   * InvestigacaoCaso createMany
   */
  export type InvestigacaoCasoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvestigacaoCasos.
     */
    data: InvestigacaoCasoCreateManyInput | InvestigacaoCasoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvestigacaoCaso createManyAndReturn
   */
  export type InvestigacaoCasoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * The data used to create many InvestigacaoCasos.
     */
    data: InvestigacaoCasoCreateManyInput | InvestigacaoCasoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvestigacaoCaso update
   */
  export type InvestigacaoCasoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * The data needed to update a InvestigacaoCaso.
     */
    data: XOR<InvestigacaoCasoUpdateInput, InvestigacaoCasoUncheckedUpdateInput>
    /**
     * Choose, which InvestigacaoCaso to update.
     */
    where: InvestigacaoCasoWhereUniqueInput
  }

  /**
   * InvestigacaoCaso updateMany
   */
  export type InvestigacaoCasoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvestigacaoCasos.
     */
    data: XOR<InvestigacaoCasoUpdateManyMutationInput, InvestigacaoCasoUncheckedUpdateManyInput>
    /**
     * Filter which InvestigacaoCasos to update
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * Limit how many InvestigacaoCasos to update.
     */
    limit?: number
  }

  /**
   * InvestigacaoCaso updateManyAndReturn
   */
  export type InvestigacaoCasoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * The data used to update InvestigacaoCasos.
     */
    data: XOR<InvestigacaoCasoUpdateManyMutationInput, InvestigacaoCasoUncheckedUpdateManyInput>
    /**
     * Filter which InvestigacaoCasos to update
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * Limit how many InvestigacaoCasos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvestigacaoCaso upsert
   */
  export type InvestigacaoCasoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * The filter to search for the InvestigacaoCaso to update in case it exists.
     */
    where: InvestigacaoCasoWhereUniqueInput
    /**
     * In case the InvestigacaoCaso found by the `where` argument doesn't exist, create a new InvestigacaoCaso with this data.
     */
    create: XOR<InvestigacaoCasoCreateInput, InvestigacaoCasoUncheckedCreateInput>
    /**
     * In case the InvestigacaoCaso was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvestigacaoCasoUpdateInput, InvestigacaoCasoUncheckedUpdateInput>
  }

  /**
   * InvestigacaoCaso delete
   */
  export type InvestigacaoCasoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
    /**
     * Filter which InvestigacaoCaso to delete.
     */
    where: InvestigacaoCasoWhereUniqueInput
  }

  /**
   * InvestigacaoCaso deleteMany
   */
  export type InvestigacaoCasoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvestigacaoCasos to delete
     */
    where?: InvestigacaoCasoWhereInput
    /**
     * Limit how many InvestigacaoCasos to delete.
     */
    limit?: number
  }

  /**
   * InvestigacaoCaso.registros
   */
  export type InvestigacaoCaso$registrosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    where?: RegistroInvestigacaoWhereInput
    orderBy?: RegistroInvestigacaoOrderByWithRelationInput | RegistroInvestigacaoOrderByWithRelationInput[]
    cursor?: RegistroInvestigacaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RegistroInvestigacaoScalarFieldEnum | RegistroInvestigacaoScalarFieldEnum[]
  }

  /**
   * InvestigacaoCaso without action
   */
  export type InvestigacaoCasoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvestigacaoCaso
     */
    select?: InvestigacaoCasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvestigacaoCaso
     */
    omit?: InvestigacaoCasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvestigacaoCasoInclude<ExtArgs> | null
  }


  /**
   * Model RegistroInvestigacao
   */

  export type AggregateRegistroInvestigacao = {
    _count: RegistroInvestigacaoCountAggregateOutputType | null
    _avg: RegistroInvestigacaoAvgAggregateOutputType | null
    _sum: RegistroInvestigacaoSumAggregateOutputType | null
    _min: RegistroInvestigacaoMinAggregateOutputType | null
    _max: RegistroInvestigacaoMaxAggregateOutputType | null
  }

  export type RegistroInvestigacaoAvgAggregateOutputType = {
    id: number | null
    investigacaoId: number | null
    ordem: number | null
  }

  export type RegistroInvestigacaoSumAggregateOutputType = {
    id: number | null
    investigacaoId: number | null
    ordem: number | null
  }

  export type RegistroInvestigacaoMinAggregateOutputType = {
    id: number | null
    investigacaoId: number | null
    tipo: string | null
    titulo: string | null
    pergunta: string | null
    resposta: string | null
    ordem: number | null
    createdAt: Date | null
  }

  export type RegistroInvestigacaoMaxAggregateOutputType = {
    id: number | null
    investigacaoId: number | null
    tipo: string | null
    titulo: string | null
    pergunta: string | null
    resposta: string | null
    ordem: number | null
    createdAt: Date | null
  }

  export type RegistroInvestigacaoCountAggregateOutputType = {
    id: number
    investigacaoId: number
    tipo: number
    titulo: number
    pergunta: number
    resposta: number
    ordem: number
    createdAt: number
    _all: number
  }


  export type RegistroInvestigacaoAvgAggregateInputType = {
    id?: true
    investigacaoId?: true
    ordem?: true
  }

  export type RegistroInvestigacaoSumAggregateInputType = {
    id?: true
    investigacaoId?: true
    ordem?: true
  }

  export type RegistroInvestigacaoMinAggregateInputType = {
    id?: true
    investigacaoId?: true
    tipo?: true
    titulo?: true
    pergunta?: true
    resposta?: true
    ordem?: true
    createdAt?: true
  }

  export type RegistroInvestigacaoMaxAggregateInputType = {
    id?: true
    investigacaoId?: true
    tipo?: true
    titulo?: true
    pergunta?: true
    resposta?: true
    ordem?: true
    createdAt?: true
  }

  export type RegistroInvestigacaoCountAggregateInputType = {
    id?: true
    investigacaoId?: true
    tipo?: true
    titulo?: true
    pergunta?: true
    resposta?: true
    ordem?: true
    createdAt?: true
    _all?: true
  }

  export type RegistroInvestigacaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistroInvestigacao to aggregate.
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistroInvestigacaos to fetch.
     */
    orderBy?: RegistroInvestigacaoOrderByWithRelationInput | RegistroInvestigacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegistroInvestigacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistroInvestigacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistroInvestigacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RegistroInvestigacaos
    **/
    _count?: true | RegistroInvestigacaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RegistroInvestigacaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RegistroInvestigacaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegistroInvestigacaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegistroInvestigacaoMaxAggregateInputType
  }

  export type GetRegistroInvestigacaoAggregateType<T extends RegistroInvestigacaoAggregateArgs> = {
        [P in keyof T & keyof AggregateRegistroInvestigacao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegistroInvestigacao[P]>
      : GetScalarType<T[P], AggregateRegistroInvestigacao[P]>
  }




  export type RegistroInvestigacaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistroInvestigacaoWhereInput
    orderBy?: RegistroInvestigacaoOrderByWithAggregationInput | RegistroInvestigacaoOrderByWithAggregationInput[]
    by: RegistroInvestigacaoScalarFieldEnum[] | RegistroInvestigacaoScalarFieldEnum
    having?: RegistroInvestigacaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegistroInvestigacaoCountAggregateInputType | true
    _avg?: RegistroInvestigacaoAvgAggregateInputType
    _sum?: RegistroInvestigacaoSumAggregateInputType
    _min?: RegistroInvestigacaoMinAggregateInputType
    _max?: RegistroInvestigacaoMaxAggregateInputType
  }

  export type RegistroInvestigacaoGroupByOutputType = {
    id: number
    investigacaoId: number
    tipo: string
    titulo: string
    pergunta: string | null
    resposta: string
    ordem: number
    createdAt: Date
    _count: RegistroInvestigacaoCountAggregateOutputType | null
    _avg: RegistroInvestigacaoAvgAggregateOutputType | null
    _sum: RegistroInvestigacaoSumAggregateOutputType | null
    _min: RegistroInvestigacaoMinAggregateOutputType | null
    _max: RegistroInvestigacaoMaxAggregateOutputType | null
  }

  type GetRegistroInvestigacaoGroupByPayload<T extends RegistroInvestigacaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegistroInvestigacaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegistroInvestigacaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegistroInvestigacaoGroupByOutputType[P]>
            : GetScalarType<T[P], RegistroInvestigacaoGroupByOutputType[P]>
        }
      >
    >


  export type RegistroInvestigacaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigacaoId?: boolean
    tipo?: boolean
    titulo?: boolean
    pergunta?: boolean
    resposta?: boolean
    ordem?: boolean
    createdAt?: boolean
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registroInvestigacao"]>

  export type RegistroInvestigacaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigacaoId?: boolean
    tipo?: boolean
    titulo?: boolean
    pergunta?: boolean
    resposta?: boolean
    ordem?: boolean
    createdAt?: boolean
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registroInvestigacao"]>

  export type RegistroInvestigacaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    investigacaoId?: boolean
    tipo?: boolean
    titulo?: boolean
    pergunta?: boolean
    resposta?: boolean
    ordem?: boolean
    createdAt?: boolean
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registroInvestigacao"]>

  export type RegistroInvestigacaoSelectScalar = {
    id?: boolean
    investigacaoId?: boolean
    tipo?: boolean
    titulo?: boolean
    pergunta?: boolean
    resposta?: boolean
    ordem?: boolean
    createdAt?: boolean
  }

  export type RegistroInvestigacaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "investigacaoId" | "tipo" | "titulo" | "pergunta" | "resposta" | "ordem" | "createdAt", ExtArgs["result"]["registroInvestigacao"]>
  export type RegistroInvestigacaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }
  export type RegistroInvestigacaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }
  export type RegistroInvestigacaoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    investigacao?: boolean | InvestigacaoCasoDefaultArgs<ExtArgs>
  }

  export type $RegistroInvestigacaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RegistroInvestigacao"
    objects: {
      investigacao: Prisma.$InvestigacaoCasoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      investigacaoId: number
      /**
       * *
       *    * Exemplos:
       *    * ANAMNESE
       *    * EXAME_FISICO
       *    * SINAL_VITAL
       *    * EXAME
       *    * EVOLUCAO
       *    * HIPOTESE
       */
      tipo: string
      titulo: string
      /**
       * *
       *    * Pergunta feita pelo usuário.
       *    * Exemplo:
       *    * "Quais são os antecedentes do paciente?"
       */
      pergunta: string | null
      /**
       * *
       *    * Resposta liberada pelo sistema.
       */
      resposta: string
      /**
       * *
       *    * Ordem cronológica da investigação.
       */
      ordem: number
      createdAt: Date
    }, ExtArgs["result"]["registroInvestigacao"]>
    composites: {}
  }

  type RegistroInvestigacaoGetPayload<S extends boolean | null | undefined | RegistroInvestigacaoDefaultArgs> = $Result.GetResult<Prisma.$RegistroInvestigacaoPayload, S>

  type RegistroInvestigacaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegistroInvestigacaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegistroInvestigacaoCountAggregateInputType | true
    }

  export interface RegistroInvestigacaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RegistroInvestigacao'], meta: { name: 'RegistroInvestigacao' } }
    /**
     * Find zero or one RegistroInvestigacao that matches the filter.
     * @param {RegistroInvestigacaoFindUniqueArgs} args - Arguments to find a RegistroInvestigacao
     * @example
     * // Get one RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistroInvestigacaoFindUniqueArgs>(args: SelectSubset<T, RegistroInvestigacaoFindUniqueArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RegistroInvestigacao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistroInvestigacaoFindUniqueOrThrowArgs} args - Arguments to find a RegistroInvestigacao
     * @example
     * // Get one RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistroInvestigacaoFindUniqueOrThrowArgs>(args: SelectSubset<T, RegistroInvestigacaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistroInvestigacao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoFindFirstArgs} args - Arguments to find a RegistroInvestigacao
     * @example
     * // Get one RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistroInvestigacaoFindFirstArgs>(args?: SelectSubset<T, RegistroInvestigacaoFindFirstArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistroInvestigacao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoFindFirstOrThrowArgs} args - Arguments to find a RegistroInvestigacao
     * @example
     * // Get one RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistroInvestigacaoFindFirstOrThrowArgs>(args?: SelectSubset<T, RegistroInvestigacaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RegistroInvestigacaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistroInvestigacaos
     * const registroInvestigacaos = await prisma.registroInvestigacao.findMany()
     * 
     * // Get first 10 RegistroInvestigacaos
     * const registroInvestigacaos = await prisma.registroInvestigacao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registroInvestigacaoWithIdOnly = await prisma.registroInvestigacao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegistroInvestigacaoFindManyArgs>(args?: SelectSubset<T, RegistroInvestigacaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RegistroInvestigacao.
     * @param {RegistroInvestigacaoCreateArgs} args - Arguments to create a RegistroInvestigacao.
     * @example
     * // Create one RegistroInvestigacao
     * const RegistroInvestigacao = await prisma.registroInvestigacao.create({
     *   data: {
     *     // ... data to create a RegistroInvestigacao
     *   }
     * })
     * 
     */
    create<T extends RegistroInvestigacaoCreateArgs>(args: SelectSubset<T, RegistroInvestigacaoCreateArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RegistroInvestigacaos.
     * @param {RegistroInvestigacaoCreateManyArgs} args - Arguments to create many RegistroInvestigacaos.
     * @example
     * // Create many RegistroInvestigacaos
     * const registroInvestigacao = await prisma.registroInvestigacao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegistroInvestigacaoCreateManyArgs>(args?: SelectSubset<T, RegistroInvestigacaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RegistroInvestigacaos and returns the data saved in the database.
     * @param {RegistroInvestigacaoCreateManyAndReturnArgs} args - Arguments to create many RegistroInvestigacaos.
     * @example
     * // Create many RegistroInvestigacaos
     * const registroInvestigacao = await prisma.registroInvestigacao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RegistroInvestigacaos and only return the `id`
     * const registroInvestigacaoWithIdOnly = await prisma.registroInvestigacao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RegistroInvestigacaoCreateManyAndReturnArgs>(args?: SelectSubset<T, RegistroInvestigacaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RegistroInvestigacao.
     * @param {RegistroInvestigacaoDeleteArgs} args - Arguments to delete one RegistroInvestigacao.
     * @example
     * // Delete one RegistroInvestigacao
     * const RegistroInvestigacao = await prisma.registroInvestigacao.delete({
     *   where: {
     *     // ... filter to delete one RegistroInvestigacao
     *   }
     * })
     * 
     */
    delete<T extends RegistroInvestigacaoDeleteArgs>(args: SelectSubset<T, RegistroInvestigacaoDeleteArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RegistroInvestigacao.
     * @param {RegistroInvestigacaoUpdateArgs} args - Arguments to update one RegistroInvestigacao.
     * @example
     * // Update one RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegistroInvestigacaoUpdateArgs>(args: SelectSubset<T, RegistroInvestigacaoUpdateArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RegistroInvestigacaos.
     * @param {RegistroInvestigacaoDeleteManyArgs} args - Arguments to filter RegistroInvestigacaos to delete.
     * @example
     * // Delete a few RegistroInvestigacaos
     * const { count } = await prisma.registroInvestigacao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegistroInvestigacaoDeleteManyArgs>(args?: SelectSubset<T, RegistroInvestigacaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistroInvestigacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistroInvestigacaos
     * const registroInvestigacao = await prisma.registroInvestigacao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegistroInvestigacaoUpdateManyArgs>(args: SelectSubset<T, RegistroInvestigacaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistroInvestigacaos and returns the data updated in the database.
     * @param {RegistroInvestigacaoUpdateManyAndReturnArgs} args - Arguments to update many RegistroInvestigacaos.
     * @example
     * // Update many RegistroInvestigacaos
     * const registroInvestigacao = await prisma.registroInvestigacao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RegistroInvestigacaos and only return the `id`
     * const registroInvestigacaoWithIdOnly = await prisma.registroInvestigacao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RegistroInvestigacaoUpdateManyAndReturnArgs>(args: SelectSubset<T, RegistroInvestigacaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RegistroInvestigacao.
     * @param {RegistroInvestigacaoUpsertArgs} args - Arguments to update or create a RegistroInvestigacao.
     * @example
     * // Update or create a RegistroInvestigacao
     * const registroInvestigacao = await prisma.registroInvestigacao.upsert({
     *   create: {
     *     // ... data to create a RegistroInvestigacao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistroInvestigacao we want to update
     *   }
     * })
     */
    upsert<T extends RegistroInvestigacaoUpsertArgs>(args: SelectSubset<T, RegistroInvestigacaoUpsertArgs<ExtArgs>>): Prisma__RegistroInvestigacaoClient<$Result.GetResult<Prisma.$RegistroInvestigacaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RegistroInvestigacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoCountArgs} args - Arguments to filter RegistroInvestigacaos to count.
     * @example
     * // Count the number of RegistroInvestigacaos
     * const count = await prisma.registroInvestigacao.count({
     *   where: {
     *     // ... the filter for the RegistroInvestigacaos we want to count
     *   }
     * })
    **/
    count<T extends RegistroInvestigacaoCountArgs>(
      args?: Subset<T, RegistroInvestigacaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegistroInvestigacaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RegistroInvestigacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegistroInvestigacaoAggregateArgs>(args: Subset<T, RegistroInvestigacaoAggregateArgs>): Prisma.PrismaPromise<GetRegistroInvestigacaoAggregateType<T>>

    /**
     * Group by RegistroInvestigacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistroInvestigacaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegistroInvestigacaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegistroInvestigacaoGroupByArgs['orderBy'] }
        : { orderBy?: RegistroInvestigacaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegistroInvestigacaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistroInvestigacaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RegistroInvestigacao model
   */
  readonly fields: RegistroInvestigacaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegistroInvestigacao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegistroInvestigacaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    investigacao<T extends InvestigacaoCasoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvestigacaoCasoDefaultArgs<ExtArgs>>): Prisma__InvestigacaoCasoClient<$Result.GetResult<Prisma.$InvestigacaoCasoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RegistroInvestigacao model
   */
  interface RegistroInvestigacaoFieldRefs {
    readonly id: FieldRef<"RegistroInvestigacao", 'Int'>
    readonly investigacaoId: FieldRef<"RegistroInvestigacao", 'Int'>
    readonly tipo: FieldRef<"RegistroInvestigacao", 'String'>
    readonly titulo: FieldRef<"RegistroInvestigacao", 'String'>
    readonly pergunta: FieldRef<"RegistroInvestigacao", 'String'>
    readonly resposta: FieldRef<"RegistroInvestigacao", 'String'>
    readonly ordem: FieldRef<"RegistroInvestigacao", 'Int'>
    readonly createdAt: FieldRef<"RegistroInvestigacao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RegistroInvestigacao findUnique
   */
  export type RegistroInvestigacaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter, which RegistroInvestigacao to fetch.
     */
    where: RegistroInvestigacaoWhereUniqueInput
  }

  /**
   * RegistroInvestigacao findUniqueOrThrow
   */
  export type RegistroInvestigacaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter, which RegistroInvestigacao to fetch.
     */
    where: RegistroInvestigacaoWhereUniqueInput
  }

  /**
   * RegistroInvestigacao findFirst
   */
  export type RegistroInvestigacaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter, which RegistroInvestigacao to fetch.
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistroInvestigacaos to fetch.
     */
    orderBy?: RegistroInvestigacaoOrderByWithRelationInput | RegistroInvestigacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistroInvestigacaos.
     */
    cursor?: RegistroInvestigacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistroInvestigacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistroInvestigacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistroInvestigacaos.
     */
    distinct?: RegistroInvestigacaoScalarFieldEnum | RegistroInvestigacaoScalarFieldEnum[]
  }

  /**
   * RegistroInvestigacao findFirstOrThrow
   */
  export type RegistroInvestigacaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter, which RegistroInvestigacao to fetch.
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistroInvestigacaos to fetch.
     */
    orderBy?: RegistroInvestigacaoOrderByWithRelationInput | RegistroInvestigacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistroInvestigacaos.
     */
    cursor?: RegistroInvestigacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistroInvestigacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistroInvestigacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistroInvestigacaos.
     */
    distinct?: RegistroInvestigacaoScalarFieldEnum | RegistroInvestigacaoScalarFieldEnum[]
  }

  /**
   * RegistroInvestigacao findMany
   */
  export type RegistroInvestigacaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter, which RegistroInvestigacaos to fetch.
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistroInvestigacaos to fetch.
     */
    orderBy?: RegistroInvestigacaoOrderByWithRelationInput | RegistroInvestigacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RegistroInvestigacaos.
     */
    cursor?: RegistroInvestigacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistroInvestigacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistroInvestigacaos.
     */
    skip?: number
    distinct?: RegistroInvestigacaoScalarFieldEnum | RegistroInvestigacaoScalarFieldEnum[]
  }

  /**
   * RegistroInvestigacao create
   */
  export type RegistroInvestigacaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * The data needed to create a RegistroInvestigacao.
     */
    data: XOR<RegistroInvestigacaoCreateInput, RegistroInvestigacaoUncheckedCreateInput>
  }

  /**
   * RegistroInvestigacao createMany
   */
  export type RegistroInvestigacaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistroInvestigacaos.
     */
    data: RegistroInvestigacaoCreateManyInput | RegistroInvestigacaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistroInvestigacao createManyAndReturn
   */
  export type RegistroInvestigacaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * The data used to create many RegistroInvestigacaos.
     */
    data: RegistroInvestigacaoCreateManyInput | RegistroInvestigacaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegistroInvestigacao update
   */
  export type RegistroInvestigacaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * The data needed to update a RegistroInvestigacao.
     */
    data: XOR<RegistroInvestigacaoUpdateInput, RegistroInvestigacaoUncheckedUpdateInput>
    /**
     * Choose, which RegistroInvestigacao to update.
     */
    where: RegistroInvestigacaoWhereUniqueInput
  }

  /**
   * RegistroInvestigacao updateMany
   */
  export type RegistroInvestigacaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistroInvestigacaos.
     */
    data: XOR<RegistroInvestigacaoUpdateManyMutationInput, RegistroInvestigacaoUncheckedUpdateManyInput>
    /**
     * Filter which RegistroInvestigacaos to update
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * Limit how many RegistroInvestigacaos to update.
     */
    limit?: number
  }

  /**
   * RegistroInvestigacao updateManyAndReturn
   */
  export type RegistroInvestigacaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * The data used to update RegistroInvestigacaos.
     */
    data: XOR<RegistroInvestigacaoUpdateManyMutationInput, RegistroInvestigacaoUncheckedUpdateManyInput>
    /**
     * Filter which RegistroInvestigacaos to update
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * Limit how many RegistroInvestigacaos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegistroInvestigacao upsert
   */
  export type RegistroInvestigacaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * The filter to search for the RegistroInvestigacao to update in case it exists.
     */
    where: RegistroInvestigacaoWhereUniqueInput
    /**
     * In case the RegistroInvestigacao found by the `where` argument doesn't exist, create a new RegistroInvestigacao with this data.
     */
    create: XOR<RegistroInvestigacaoCreateInput, RegistroInvestigacaoUncheckedCreateInput>
    /**
     * In case the RegistroInvestigacao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegistroInvestigacaoUpdateInput, RegistroInvestigacaoUncheckedUpdateInput>
  }

  /**
   * RegistroInvestigacao delete
   */
  export type RegistroInvestigacaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
    /**
     * Filter which RegistroInvestigacao to delete.
     */
    where: RegistroInvestigacaoWhereUniqueInput
  }

  /**
   * RegistroInvestigacao deleteMany
   */
  export type RegistroInvestigacaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistroInvestigacaos to delete
     */
    where?: RegistroInvestigacaoWhereInput
    /**
     * Limit how many RegistroInvestigacaos to delete.
     */
    limit?: number
  }

  /**
   * RegistroInvestigacao without action
   */
  export type RegistroInvestigacaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistroInvestigacao
     */
    select?: RegistroInvestigacaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistroInvestigacao
     */
    omit?: RegistroInvestigacaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistroInvestigacaoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    senhaHash: 'senhaHash',
    createdAt: 'createdAt'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const DisciplinaScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    createdAt: 'createdAt',
    usuarioId: 'usuarioId'
  };

  export type DisciplinaScalarFieldEnum = (typeof DisciplinaScalarFieldEnum)[keyof typeof DisciplinaScalarFieldEnum]


  export const QuestaoScalarFieldEnum: {
    id: 'id',
    enunciado: 'enunciado',
    explicacao: 'explicacao',
    tema: 'tema',
    dificuldade: 'dificuldade',
    createdAt: 'createdAt',
    usuarioId: 'usuarioId',
    disciplinaId: 'disciplinaId'
  };

  export type QuestaoScalarFieldEnum = (typeof QuestaoScalarFieldEnum)[keyof typeof QuestaoScalarFieldEnum]


  export const AlternativaScalarFieldEnum: {
    id: 'id',
    texto: 'texto',
    correta: 'correta',
    questaoId: 'questaoId'
  };

  export type AlternativaScalarFieldEnum = (typeof AlternativaScalarFieldEnum)[keyof typeof AlternativaScalarFieldEnum]


  export const RespostaScalarFieldEnum: {
    id: 'id',
    correta: 'correta',
    respondidaAt: 'respondidaAt',
    usuarioId: 'usuarioId',
    questaoId: 'questaoId'
  };

  export type RespostaScalarFieldEnum = (typeof RespostaScalarFieldEnum)[keyof typeof RespostaScalarFieldEnum]


  export const FlashcardScalarFieldEnum: {
    id: 'id',
    frente: 'frente',
    verso: 'verso',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    usuarioId: 'usuarioId'
  };

  export type FlashcardScalarFieldEnum = (typeof FlashcardScalarFieldEnum)[keyof typeof FlashcardScalarFieldEnum]


  export const MovimentacaoScalarFieldEnum: {
    id: 'id',
    descricao: 'descricao',
    valor: 'valor',
    tipo: 'tipo',
    data: 'data',
    createdAt: 'createdAt',
    usuarioId: 'usuarioId'
  };

  export type MovimentacaoScalarFieldEnum = (typeof MovimentacaoScalarFieldEnum)[keyof typeof MovimentacaoScalarFieldEnum]


  export const CasoClinicoScalarFieldEnum: {
    id: 'id',
    titulo: 'titulo',
    area: 'area',
    especialidade: 'especialidade',
    dificuldade: 'dificuldade',
    cenario: 'cenario',
    queixaInicial: 'queixaInicial',
    dadosIniciais: 'dadosIniciais',
    anamnese: 'anamnese',
    exameFisico: 'exameFisico',
    sinaisVitais: 'sinaisVitais',
    exames: 'exames',
    evolucao: 'evolucao',
    diagnosticoFinal: 'diagnosticoFinal',
    explicacaoDiagnostico: 'explicacaoDiagnostico',
    diagnosticosDiferenciais: 'diagnosticosDiferenciais',
    pontosChave: 'pontosChave',
    publicado: 'publicado',
    geradoPorIA: 'geradoPorIA',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    autorId: 'autorId'
  };

  export type CasoClinicoScalarFieldEnum = (typeof CasoClinicoScalarFieldEnum)[keyof typeof CasoClinicoScalarFieldEnum]


  export const ExameCasoScalarFieldEnum: {
    id: 'id',
    casoId: 'casoId',
    nome: 'nome',
    categoria: 'categoria',
    resultado: 'resultado',
    interpretacao: 'interpretacao',
    disponivel: 'disponivel',
    ordem: 'ordem',
    createdAt: 'createdAt'
  };

  export type ExameCasoScalarFieldEnum = (typeof ExameCasoScalarFieldEnum)[keyof typeof ExameCasoScalarFieldEnum]


  export const InvestigacaoCasoScalarFieldEnum: {
    id: 'id',
    casoId: 'casoId',
    usuarioId: 'usuarioId',
    status: 'status',
    informacoesColetadas: 'informacoesColetadas',
    hipotese: 'hipotese',
    justificativa: 'justificativa',
    avaliacao: 'avaliacao',
    finalizado: 'finalizado',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvestigacaoCasoScalarFieldEnum = (typeof InvestigacaoCasoScalarFieldEnum)[keyof typeof InvestigacaoCasoScalarFieldEnum]


  export const RegistroInvestigacaoScalarFieldEnum: {
    id: 'id',
    investigacaoId: 'investigacaoId',
    tipo: 'tipo',
    titulo: 'titulo',
    pergunta: 'pergunta',
    resposta: 'resposta',
    ordem: 'ordem',
    createdAt: 'createdAt'
  };

  export type RegistroInvestigacaoScalarFieldEnum = (typeof RegistroInvestigacaoScalarFieldEnum)[keyof typeof RegistroInvestigacaoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'TipoMovimentacao'
   */
  export type EnumTipoMovimentacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoMovimentacao'>
    


  /**
   * Reference to a field of type 'TipoMovimentacao[]'
   */
  export type ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoMovimentacao[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    nome?: StringFilter<"Usuario"> | string
    email?: StringFilter<"Usuario"> | string
    senhaHash?: StringNullableFilter<"Usuario"> | string | null
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    disciplinas?: DisciplinaListRelationFilter
    questoes?: QuestaoListRelationFilter
    respostas?: RespostaListRelationFilter
    flashcards?: FlashcardListRelationFilter
    movimentacoes?: MovimentacaoListRelationFilter
    casosCriados?: CasoClinicoListRelationFilter
    investigacoes?: InvestigacaoCasoListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    disciplinas?: DisciplinaOrderByRelationAggregateInput
    questoes?: QuestaoOrderByRelationAggregateInput
    respostas?: RespostaOrderByRelationAggregateInput
    flashcards?: FlashcardOrderByRelationAggregateInput
    movimentacoes?: MovimentacaoOrderByRelationAggregateInput
    casosCriados?: CasoClinicoOrderByRelationAggregateInput
    investigacoes?: InvestigacaoCasoOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nome?: StringFilter<"Usuario"> | string
    senhaHash?: StringNullableFilter<"Usuario"> | string | null
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    disciplinas?: DisciplinaListRelationFilter
    questoes?: QuestaoListRelationFilter
    respostas?: RespostaListRelationFilter
    flashcards?: FlashcardListRelationFilter
    movimentacoes?: MovimentacaoListRelationFilter
    casosCriados?: CasoClinicoListRelationFilter
    investigacoes?: InvestigacaoCasoListRelationFilter
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    nome?: StringWithAggregatesFilter<"Usuario"> | string
    email?: StringWithAggregatesFilter<"Usuario"> | string
    senhaHash?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type DisciplinaWhereInput = {
    AND?: DisciplinaWhereInput | DisciplinaWhereInput[]
    OR?: DisciplinaWhereInput[]
    NOT?: DisciplinaWhereInput | DisciplinaWhereInput[]
    id?: IntFilter<"Disciplina"> | number
    nome?: StringFilter<"Disciplina"> | string
    createdAt?: DateTimeFilter<"Disciplina"> | Date | string
    usuarioId?: IntFilter<"Disciplina"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    questoes?: QuestaoListRelationFilter
  }

  export type DisciplinaOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    questoes?: QuestaoOrderByRelationAggregateInput
  }

  export type DisciplinaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DisciplinaWhereInput | DisciplinaWhereInput[]
    OR?: DisciplinaWhereInput[]
    NOT?: DisciplinaWhereInput | DisciplinaWhereInput[]
    nome?: StringFilter<"Disciplina"> | string
    createdAt?: DateTimeFilter<"Disciplina"> | Date | string
    usuarioId?: IntFilter<"Disciplina"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    questoes?: QuestaoListRelationFilter
  }, "id">

  export type DisciplinaOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    _count?: DisciplinaCountOrderByAggregateInput
    _avg?: DisciplinaAvgOrderByAggregateInput
    _max?: DisciplinaMaxOrderByAggregateInput
    _min?: DisciplinaMinOrderByAggregateInput
    _sum?: DisciplinaSumOrderByAggregateInput
  }

  export type DisciplinaScalarWhereWithAggregatesInput = {
    AND?: DisciplinaScalarWhereWithAggregatesInput | DisciplinaScalarWhereWithAggregatesInput[]
    OR?: DisciplinaScalarWhereWithAggregatesInput[]
    NOT?: DisciplinaScalarWhereWithAggregatesInput | DisciplinaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Disciplina"> | number
    nome?: StringWithAggregatesFilter<"Disciplina"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Disciplina"> | Date | string
    usuarioId?: IntWithAggregatesFilter<"Disciplina"> | number
  }

  export type QuestaoWhereInput = {
    AND?: QuestaoWhereInput | QuestaoWhereInput[]
    OR?: QuestaoWhereInput[]
    NOT?: QuestaoWhereInput | QuestaoWhereInput[]
    id?: IntFilter<"Questao"> | number
    enunciado?: StringFilter<"Questao"> | string
    explicacao?: StringNullableFilter<"Questao"> | string | null
    tema?: StringNullableFilter<"Questao"> | string | null
    dificuldade?: StringNullableFilter<"Questao"> | string | null
    createdAt?: DateTimeFilter<"Questao"> | Date | string
    usuarioId?: IntFilter<"Questao"> | number
    disciplinaId?: IntFilter<"Questao"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    disciplina?: XOR<DisciplinaScalarRelationFilter, DisciplinaWhereInput>
    alternativas?: AlternativaListRelationFilter
    respostas?: RespostaListRelationFilter
  }

  export type QuestaoOrderByWithRelationInput = {
    id?: SortOrder
    enunciado?: SortOrder
    explicacao?: SortOrderInput | SortOrder
    tema?: SortOrderInput | SortOrder
    dificuldade?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    disciplina?: DisciplinaOrderByWithRelationInput
    alternativas?: AlternativaOrderByRelationAggregateInput
    respostas?: RespostaOrderByRelationAggregateInput
  }

  export type QuestaoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QuestaoWhereInput | QuestaoWhereInput[]
    OR?: QuestaoWhereInput[]
    NOT?: QuestaoWhereInput | QuestaoWhereInput[]
    enunciado?: StringFilter<"Questao"> | string
    explicacao?: StringNullableFilter<"Questao"> | string | null
    tema?: StringNullableFilter<"Questao"> | string | null
    dificuldade?: StringNullableFilter<"Questao"> | string | null
    createdAt?: DateTimeFilter<"Questao"> | Date | string
    usuarioId?: IntFilter<"Questao"> | number
    disciplinaId?: IntFilter<"Questao"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    disciplina?: XOR<DisciplinaScalarRelationFilter, DisciplinaWhereInput>
    alternativas?: AlternativaListRelationFilter
    respostas?: RespostaListRelationFilter
  }, "id">

  export type QuestaoOrderByWithAggregationInput = {
    id?: SortOrder
    enunciado?: SortOrder
    explicacao?: SortOrderInput | SortOrder
    tema?: SortOrderInput | SortOrder
    dificuldade?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
    _count?: QuestaoCountOrderByAggregateInput
    _avg?: QuestaoAvgOrderByAggregateInput
    _max?: QuestaoMaxOrderByAggregateInput
    _min?: QuestaoMinOrderByAggregateInput
    _sum?: QuestaoSumOrderByAggregateInput
  }

  export type QuestaoScalarWhereWithAggregatesInput = {
    AND?: QuestaoScalarWhereWithAggregatesInput | QuestaoScalarWhereWithAggregatesInput[]
    OR?: QuestaoScalarWhereWithAggregatesInput[]
    NOT?: QuestaoScalarWhereWithAggregatesInput | QuestaoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Questao"> | number
    enunciado?: StringWithAggregatesFilter<"Questao"> | string
    explicacao?: StringNullableWithAggregatesFilter<"Questao"> | string | null
    tema?: StringNullableWithAggregatesFilter<"Questao"> | string | null
    dificuldade?: StringNullableWithAggregatesFilter<"Questao"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Questao"> | Date | string
    usuarioId?: IntWithAggregatesFilter<"Questao"> | number
    disciplinaId?: IntWithAggregatesFilter<"Questao"> | number
  }

  export type AlternativaWhereInput = {
    AND?: AlternativaWhereInput | AlternativaWhereInput[]
    OR?: AlternativaWhereInput[]
    NOT?: AlternativaWhereInput | AlternativaWhereInput[]
    id?: IntFilter<"Alternativa"> | number
    texto?: StringFilter<"Alternativa"> | string
    correta?: BoolFilter<"Alternativa"> | boolean
    questaoId?: IntFilter<"Alternativa"> | number
    questao?: XOR<QuestaoScalarRelationFilter, QuestaoWhereInput>
  }

  export type AlternativaOrderByWithRelationInput = {
    id?: SortOrder
    texto?: SortOrder
    correta?: SortOrder
    questaoId?: SortOrder
    questao?: QuestaoOrderByWithRelationInput
  }

  export type AlternativaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AlternativaWhereInput | AlternativaWhereInput[]
    OR?: AlternativaWhereInput[]
    NOT?: AlternativaWhereInput | AlternativaWhereInput[]
    texto?: StringFilter<"Alternativa"> | string
    correta?: BoolFilter<"Alternativa"> | boolean
    questaoId?: IntFilter<"Alternativa"> | number
    questao?: XOR<QuestaoScalarRelationFilter, QuestaoWhereInput>
  }, "id">

  export type AlternativaOrderByWithAggregationInput = {
    id?: SortOrder
    texto?: SortOrder
    correta?: SortOrder
    questaoId?: SortOrder
    _count?: AlternativaCountOrderByAggregateInput
    _avg?: AlternativaAvgOrderByAggregateInput
    _max?: AlternativaMaxOrderByAggregateInput
    _min?: AlternativaMinOrderByAggregateInput
    _sum?: AlternativaSumOrderByAggregateInput
  }

  export type AlternativaScalarWhereWithAggregatesInput = {
    AND?: AlternativaScalarWhereWithAggregatesInput | AlternativaScalarWhereWithAggregatesInput[]
    OR?: AlternativaScalarWhereWithAggregatesInput[]
    NOT?: AlternativaScalarWhereWithAggregatesInput | AlternativaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Alternativa"> | number
    texto?: StringWithAggregatesFilter<"Alternativa"> | string
    correta?: BoolWithAggregatesFilter<"Alternativa"> | boolean
    questaoId?: IntWithAggregatesFilter<"Alternativa"> | number
  }

  export type RespostaWhereInput = {
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    id?: IntFilter<"Resposta"> | number
    correta?: BoolFilter<"Resposta"> | boolean
    respondidaAt?: DateTimeFilter<"Resposta"> | Date | string
    usuarioId?: IntFilter<"Resposta"> | number
    questaoId?: IntFilter<"Resposta"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    questao?: XOR<QuestaoScalarRelationFilter, QuestaoWhereInput>
  }

  export type RespostaOrderByWithRelationInput = {
    id?: SortOrder
    correta?: SortOrder
    respondidaAt?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
    questao?: QuestaoOrderByWithRelationInput
  }

  export type RespostaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    correta?: BoolFilter<"Resposta"> | boolean
    respondidaAt?: DateTimeFilter<"Resposta"> | Date | string
    usuarioId?: IntFilter<"Resposta"> | number
    questaoId?: IntFilter<"Resposta"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    questao?: XOR<QuestaoScalarRelationFilter, QuestaoWhereInput>
  }, "id">

  export type RespostaOrderByWithAggregationInput = {
    id?: SortOrder
    correta?: SortOrder
    respondidaAt?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
    _count?: RespostaCountOrderByAggregateInput
    _avg?: RespostaAvgOrderByAggregateInput
    _max?: RespostaMaxOrderByAggregateInput
    _min?: RespostaMinOrderByAggregateInput
    _sum?: RespostaSumOrderByAggregateInput
  }

  export type RespostaScalarWhereWithAggregatesInput = {
    AND?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    OR?: RespostaScalarWhereWithAggregatesInput[]
    NOT?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Resposta"> | number
    correta?: BoolWithAggregatesFilter<"Resposta"> | boolean
    respondidaAt?: DateTimeWithAggregatesFilter<"Resposta"> | Date | string
    usuarioId?: IntWithAggregatesFilter<"Resposta"> | number
    questaoId?: IntWithAggregatesFilter<"Resposta"> | number
  }

  export type FlashcardWhereInput = {
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    id?: IntFilter<"Flashcard"> | number
    frente?: StringFilter<"Flashcard"> | string
    verso?: StringFilter<"Flashcard"> | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
    usuarioId?: IntFilter<"Flashcard"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }

  export type FlashcardOrderByWithRelationInput = {
    id?: SortOrder
    frente?: SortOrder
    verso?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarioId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type FlashcardWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    frente?: StringFilter<"Flashcard"> | string
    verso?: StringFilter<"Flashcard"> | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
    usuarioId?: IntFilter<"Flashcard"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }, "id">

  export type FlashcardOrderByWithAggregationInput = {
    id?: SortOrder
    frente?: SortOrder
    verso?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarioId?: SortOrder
    _count?: FlashcardCountOrderByAggregateInput
    _avg?: FlashcardAvgOrderByAggregateInput
    _max?: FlashcardMaxOrderByAggregateInput
    _min?: FlashcardMinOrderByAggregateInput
    _sum?: FlashcardSumOrderByAggregateInput
  }

  export type FlashcardScalarWhereWithAggregatesInput = {
    AND?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    OR?: FlashcardScalarWhereWithAggregatesInput[]
    NOT?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Flashcard"> | number
    frente?: StringWithAggregatesFilter<"Flashcard"> | string
    verso?: StringWithAggregatesFilter<"Flashcard"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Flashcard"> | Date | string
    usuarioId?: IntWithAggregatesFilter<"Flashcard"> | number
  }

  export type MovimentacaoWhereInput = {
    AND?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    OR?: MovimentacaoWhereInput[]
    NOT?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    id?: IntFilter<"Movimentacao"> | number
    descricao?: StringFilter<"Movimentacao"> | string
    valor?: DecimalFilter<"Movimentacao"> | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFilter<"Movimentacao"> | $Enums.TipoMovimentacao
    data?: DateTimeFilter<"Movimentacao"> | Date | string
    createdAt?: DateTimeFilter<"Movimentacao"> | Date | string
    usuarioId?: IntFilter<"Movimentacao"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }

  export type MovimentacaoOrderByWithRelationInput = {
    id?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type MovimentacaoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    OR?: MovimentacaoWhereInput[]
    NOT?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    descricao?: StringFilter<"Movimentacao"> | string
    valor?: DecimalFilter<"Movimentacao"> | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFilter<"Movimentacao"> | $Enums.TipoMovimentacao
    data?: DateTimeFilter<"Movimentacao"> | Date | string
    createdAt?: DateTimeFilter<"Movimentacao"> | Date | string
    usuarioId?: IntFilter<"Movimentacao"> | number
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
  }, "id">

  export type MovimentacaoOrderByWithAggregationInput = {
    id?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    _count?: MovimentacaoCountOrderByAggregateInput
    _avg?: MovimentacaoAvgOrderByAggregateInput
    _max?: MovimentacaoMaxOrderByAggregateInput
    _min?: MovimentacaoMinOrderByAggregateInput
    _sum?: MovimentacaoSumOrderByAggregateInput
  }

  export type MovimentacaoScalarWhereWithAggregatesInput = {
    AND?: MovimentacaoScalarWhereWithAggregatesInput | MovimentacaoScalarWhereWithAggregatesInput[]
    OR?: MovimentacaoScalarWhereWithAggregatesInput[]
    NOT?: MovimentacaoScalarWhereWithAggregatesInput | MovimentacaoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Movimentacao"> | number
    descricao?: StringWithAggregatesFilter<"Movimentacao"> | string
    valor?: DecimalWithAggregatesFilter<"Movimentacao"> | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoWithAggregatesFilter<"Movimentacao"> | $Enums.TipoMovimentacao
    data?: DateTimeWithAggregatesFilter<"Movimentacao"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Movimentacao"> | Date | string
    usuarioId?: IntWithAggregatesFilter<"Movimentacao"> | number
  }

  export type CasoClinicoWhereInput = {
    AND?: CasoClinicoWhereInput | CasoClinicoWhereInput[]
    OR?: CasoClinicoWhereInput[]
    NOT?: CasoClinicoWhereInput | CasoClinicoWhereInput[]
    id?: IntFilter<"CasoClinico"> | number
    titulo?: StringFilter<"CasoClinico"> | string
    area?: StringFilter<"CasoClinico"> | string
    especialidade?: StringNullableFilter<"CasoClinico"> | string | null
    dificuldade?: StringFilter<"CasoClinico"> | string
    cenario?: StringFilter<"CasoClinico"> | string
    queixaInicial?: StringFilter<"CasoClinico"> | string
    dadosIniciais?: JsonFilter<"CasoClinico">
    anamnese?: JsonFilter<"CasoClinico">
    exameFisico?: JsonFilter<"CasoClinico">
    sinaisVitais?: JsonFilter<"CasoClinico">
    exames?: JsonFilter<"CasoClinico">
    evolucao?: JsonFilter<"CasoClinico">
    diagnosticoFinal?: StringFilter<"CasoClinico"> | string
    explicacaoDiagnostico?: StringFilter<"CasoClinico"> | string
    diagnosticosDiferenciais?: JsonFilter<"CasoClinico">
    pontosChave?: JsonFilter<"CasoClinico">
    publicado?: BoolFilter<"CasoClinico"> | boolean
    geradoPorIA?: BoolFilter<"CasoClinico"> | boolean
    createdAt?: DateTimeFilter<"CasoClinico"> | Date | string
    updatedAt?: DateTimeFilter<"CasoClinico"> | Date | string
    autorId?: IntFilter<"CasoClinico"> | number
    autor?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    investigacoes?: InvestigacaoCasoListRelationFilter
    examesCaso?: ExameCasoListRelationFilter
  }

  export type CasoClinicoOrderByWithRelationInput = {
    id?: SortOrder
    titulo?: SortOrder
    area?: SortOrder
    especialidade?: SortOrderInput | SortOrder
    dificuldade?: SortOrder
    cenario?: SortOrder
    queixaInicial?: SortOrder
    dadosIniciais?: SortOrder
    anamnese?: SortOrder
    exameFisico?: SortOrder
    sinaisVitais?: SortOrder
    exames?: SortOrder
    evolucao?: SortOrder
    diagnosticoFinal?: SortOrder
    explicacaoDiagnostico?: SortOrder
    diagnosticosDiferenciais?: SortOrder
    pontosChave?: SortOrder
    publicado?: SortOrder
    geradoPorIA?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    autorId?: SortOrder
    autor?: UsuarioOrderByWithRelationInput
    investigacoes?: InvestigacaoCasoOrderByRelationAggregateInput
    examesCaso?: ExameCasoOrderByRelationAggregateInput
  }

  export type CasoClinicoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CasoClinicoWhereInput | CasoClinicoWhereInput[]
    OR?: CasoClinicoWhereInput[]
    NOT?: CasoClinicoWhereInput | CasoClinicoWhereInput[]
    titulo?: StringFilter<"CasoClinico"> | string
    area?: StringFilter<"CasoClinico"> | string
    especialidade?: StringNullableFilter<"CasoClinico"> | string | null
    dificuldade?: StringFilter<"CasoClinico"> | string
    cenario?: StringFilter<"CasoClinico"> | string
    queixaInicial?: StringFilter<"CasoClinico"> | string
    dadosIniciais?: JsonFilter<"CasoClinico">
    anamnese?: JsonFilter<"CasoClinico">
    exameFisico?: JsonFilter<"CasoClinico">
    sinaisVitais?: JsonFilter<"CasoClinico">
    exames?: JsonFilter<"CasoClinico">
    evolucao?: JsonFilter<"CasoClinico">
    diagnosticoFinal?: StringFilter<"CasoClinico"> | string
    explicacaoDiagnostico?: StringFilter<"CasoClinico"> | string
    diagnosticosDiferenciais?: JsonFilter<"CasoClinico">
    pontosChave?: JsonFilter<"CasoClinico">
    publicado?: BoolFilter<"CasoClinico"> | boolean
    geradoPorIA?: BoolFilter<"CasoClinico"> | boolean
    createdAt?: DateTimeFilter<"CasoClinico"> | Date | string
    updatedAt?: DateTimeFilter<"CasoClinico"> | Date | string
    autorId?: IntFilter<"CasoClinico"> | number
    autor?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    investigacoes?: InvestigacaoCasoListRelationFilter
    examesCaso?: ExameCasoListRelationFilter
  }, "id">

  export type CasoClinicoOrderByWithAggregationInput = {
    id?: SortOrder
    titulo?: SortOrder
    area?: SortOrder
    especialidade?: SortOrderInput | SortOrder
    dificuldade?: SortOrder
    cenario?: SortOrder
    queixaInicial?: SortOrder
    dadosIniciais?: SortOrder
    anamnese?: SortOrder
    exameFisico?: SortOrder
    sinaisVitais?: SortOrder
    exames?: SortOrder
    evolucao?: SortOrder
    diagnosticoFinal?: SortOrder
    explicacaoDiagnostico?: SortOrder
    diagnosticosDiferenciais?: SortOrder
    pontosChave?: SortOrder
    publicado?: SortOrder
    geradoPorIA?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    autorId?: SortOrder
    _count?: CasoClinicoCountOrderByAggregateInput
    _avg?: CasoClinicoAvgOrderByAggregateInput
    _max?: CasoClinicoMaxOrderByAggregateInput
    _min?: CasoClinicoMinOrderByAggregateInput
    _sum?: CasoClinicoSumOrderByAggregateInput
  }

  export type CasoClinicoScalarWhereWithAggregatesInput = {
    AND?: CasoClinicoScalarWhereWithAggregatesInput | CasoClinicoScalarWhereWithAggregatesInput[]
    OR?: CasoClinicoScalarWhereWithAggregatesInput[]
    NOT?: CasoClinicoScalarWhereWithAggregatesInput | CasoClinicoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CasoClinico"> | number
    titulo?: StringWithAggregatesFilter<"CasoClinico"> | string
    area?: StringWithAggregatesFilter<"CasoClinico"> | string
    especialidade?: StringNullableWithAggregatesFilter<"CasoClinico"> | string | null
    dificuldade?: StringWithAggregatesFilter<"CasoClinico"> | string
    cenario?: StringWithAggregatesFilter<"CasoClinico"> | string
    queixaInicial?: StringWithAggregatesFilter<"CasoClinico"> | string
    dadosIniciais?: JsonWithAggregatesFilter<"CasoClinico">
    anamnese?: JsonWithAggregatesFilter<"CasoClinico">
    exameFisico?: JsonWithAggregatesFilter<"CasoClinico">
    sinaisVitais?: JsonWithAggregatesFilter<"CasoClinico">
    exames?: JsonWithAggregatesFilter<"CasoClinico">
    evolucao?: JsonWithAggregatesFilter<"CasoClinico">
    diagnosticoFinal?: StringWithAggregatesFilter<"CasoClinico"> | string
    explicacaoDiagnostico?: StringWithAggregatesFilter<"CasoClinico"> | string
    diagnosticosDiferenciais?: JsonWithAggregatesFilter<"CasoClinico">
    pontosChave?: JsonWithAggregatesFilter<"CasoClinico">
    publicado?: BoolWithAggregatesFilter<"CasoClinico"> | boolean
    geradoPorIA?: BoolWithAggregatesFilter<"CasoClinico"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CasoClinico"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CasoClinico"> | Date | string
    autorId?: IntWithAggregatesFilter<"CasoClinico"> | number
  }

  export type ExameCasoWhereInput = {
    AND?: ExameCasoWhereInput | ExameCasoWhereInput[]
    OR?: ExameCasoWhereInput[]
    NOT?: ExameCasoWhereInput | ExameCasoWhereInput[]
    id?: IntFilter<"ExameCaso"> | number
    casoId?: IntFilter<"ExameCaso"> | number
    nome?: StringFilter<"ExameCaso"> | string
    categoria?: StringNullableFilter<"ExameCaso"> | string | null
    resultado?: StringFilter<"ExameCaso"> | string
    interpretacao?: StringNullableFilter<"ExameCaso"> | string | null
    disponivel?: BoolFilter<"ExameCaso"> | boolean
    ordem?: IntFilter<"ExameCaso"> | number
    createdAt?: DateTimeFilter<"ExameCaso"> | Date | string
    caso?: XOR<CasoClinicoScalarRelationFilter, CasoClinicoWhereInput>
  }

  export type ExameCasoOrderByWithRelationInput = {
    id?: SortOrder
    casoId?: SortOrder
    nome?: SortOrder
    categoria?: SortOrderInput | SortOrder
    resultado?: SortOrder
    interpretacao?: SortOrderInput | SortOrder
    disponivel?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    caso?: CasoClinicoOrderByWithRelationInput
  }

  export type ExameCasoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ExameCasoWhereInput | ExameCasoWhereInput[]
    OR?: ExameCasoWhereInput[]
    NOT?: ExameCasoWhereInput | ExameCasoWhereInput[]
    casoId?: IntFilter<"ExameCaso"> | number
    nome?: StringFilter<"ExameCaso"> | string
    categoria?: StringNullableFilter<"ExameCaso"> | string | null
    resultado?: StringFilter<"ExameCaso"> | string
    interpretacao?: StringNullableFilter<"ExameCaso"> | string | null
    disponivel?: BoolFilter<"ExameCaso"> | boolean
    ordem?: IntFilter<"ExameCaso"> | number
    createdAt?: DateTimeFilter<"ExameCaso"> | Date | string
    caso?: XOR<CasoClinicoScalarRelationFilter, CasoClinicoWhereInput>
  }, "id">

  export type ExameCasoOrderByWithAggregationInput = {
    id?: SortOrder
    casoId?: SortOrder
    nome?: SortOrder
    categoria?: SortOrderInput | SortOrder
    resultado?: SortOrder
    interpretacao?: SortOrderInput | SortOrder
    disponivel?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    _count?: ExameCasoCountOrderByAggregateInput
    _avg?: ExameCasoAvgOrderByAggregateInput
    _max?: ExameCasoMaxOrderByAggregateInput
    _min?: ExameCasoMinOrderByAggregateInput
    _sum?: ExameCasoSumOrderByAggregateInput
  }

  export type ExameCasoScalarWhereWithAggregatesInput = {
    AND?: ExameCasoScalarWhereWithAggregatesInput | ExameCasoScalarWhereWithAggregatesInput[]
    OR?: ExameCasoScalarWhereWithAggregatesInput[]
    NOT?: ExameCasoScalarWhereWithAggregatesInput | ExameCasoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ExameCaso"> | number
    casoId?: IntWithAggregatesFilter<"ExameCaso"> | number
    nome?: StringWithAggregatesFilter<"ExameCaso"> | string
    categoria?: StringNullableWithAggregatesFilter<"ExameCaso"> | string | null
    resultado?: StringWithAggregatesFilter<"ExameCaso"> | string
    interpretacao?: StringNullableWithAggregatesFilter<"ExameCaso"> | string | null
    disponivel?: BoolWithAggregatesFilter<"ExameCaso"> | boolean
    ordem?: IntWithAggregatesFilter<"ExameCaso"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ExameCaso"> | Date | string
  }

  export type InvestigacaoCasoWhereInput = {
    AND?: InvestigacaoCasoWhereInput | InvestigacaoCasoWhereInput[]
    OR?: InvestigacaoCasoWhereInput[]
    NOT?: InvestigacaoCasoWhereInput | InvestigacaoCasoWhereInput[]
    id?: IntFilter<"InvestigacaoCaso"> | number
    casoId?: IntFilter<"InvestigacaoCaso"> | number
    usuarioId?: IntFilter<"InvestigacaoCaso"> | number
    status?: StringFilter<"InvestigacaoCaso"> | string
    informacoesColetadas?: JsonFilter<"InvestigacaoCaso">
    hipotese?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    justificativa?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    avaliacao?: JsonNullableFilter<"InvestigacaoCaso">
    finalizado?: BoolFilter<"InvestigacaoCaso"> | boolean
    createdAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
    caso?: XOR<CasoClinicoScalarRelationFilter, CasoClinicoWhereInput>
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    registros?: RegistroInvestigacaoListRelationFilter
  }

  export type InvestigacaoCasoOrderByWithRelationInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
    status?: SortOrder
    informacoesColetadas?: SortOrder
    hipotese?: SortOrderInput | SortOrder
    justificativa?: SortOrderInput | SortOrder
    avaliacao?: SortOrderInput | SortOrder
    finalizado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    caso?: CasoClinicoOrderByWithRelationInput
    usuario?: UsuarioOrderByWithRelationInput
    registros?: RegistroInvestigacaoOrderByRelationAggregateInput
  }

  export type InvestigacaoCasoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    casoId_usuarioId?: InvestigacaoCasoCasoIdUsuarioIdCompoundUniqueInput
    AND?: InvestigacaoCasoWhereInput | InvestigacaoCasoWhereInput[]
    OR?: InvestigacaoCasoWhereInput[]
    NOT?: InvestigacaoCasoWhereInput | InvestigacaoCasoWhereInput[]
    casoId?: IntFilter<"InvestigacaoCaso"> | number
    usuarioId?: IntFilter<"InvestigacaoCaso"> | number
    status?: StringFilter<"InvestigacaoCaso"> | string
    informacoesColetadas?: JsonFilter<"InvestigacaoCaso">
    hipotese?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    justificativa?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    avaliacao?: JsonNullableFilter<"InvestigacaoCaso">
    finalizado?: BoolFilter<"InvestigacaoCaso"> | boolean
    createdAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
    caso?: XOR<CasoClinicoScalarRelationFilter, CasoClinicoWhereInput>
    usuario?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    registros?: RegistroInvestigacaoListRelationFilter
  }, "id" | "casoId_usuarioId">

  export type InvestigacaoCasoOrderByWithAggregationInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
    status?: SortOrder
    informacoesColetadas?: SortOrder
    hipotese?: SortOrderInput | SortOrder
    justificativa?: SortOrderInput | SortOrder
    avaliacao?: SortOrderInput | SortOrder
    finalizado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvestigacaoCasoCountOrderByAggregateInput
    _avg?: InvestigacaoCasoAvgOrderByAggregateInput
    _max?: InvestigacaoCasoMaxOrderByAggregateInput
    _min?: InvestigacaoCasoMinOrderByAggregateInput
    _sum?: InvestigacaoCasoSumOrderByAggregateInput
  }

  export type InvestigacaoCasoScalarWhereWithAggregatesInput = {
    AND?: InvestigacaoCasoScalarWhereWithAggregatesInput | InvestigacaoCasoScalarWhereWithAggregatesInput[]
    OR?: InvestigacaoCasoScalarWhereWithAggregatesInput[]
    NOT?: InvestigacaoCasoScalarWhereWithAggregatesInput | InvestigacaoCasoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"InvestigacaoCaso"> | number
    casoId?: IntWithAggregatesFilter<"InvestigacaoCaso"> | number
    usuarioId?: IntWithAggregatesFilter<"InvestigacaoCaso"> | number
    status?: StringWithAggregatesFilter<"InvestigacaoCaso"> | string
    informacoesColetadas?: JsonWithAggregatesFilter<"InvestigacaoCaso">
    hipotese?: StringNullableWithAggregatesFilter<"InvestigacaoCaso"> | string | null
    justificativa?: StringNullableWithAggregatesFilter<"InvestigacaoCaso"> | string | null
    avaliacao?: JsonNullableWithAggregatesFilter<"InvestigacaoCaso">
    finalizado?: BoolWithAggregatesFilter<"InvestigacaoCaso"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"InvestigacaoCaso"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvestigacaoCaso"> | Date | string
  }

  export type RegistroInvestigacaoWhereInput = {
    AND?: RegistroInvestigacaoWhereInput | RegistroInvestigacaoWhereInput[]
    OR?: RegistroInvestigacaoWhereInput[]
    NOT?: RegistroInvestigacaoWhereInput | RegistroInvestigacaoWhereInput[]
    id?: IntFilter<"RegistroInvestigacao"> | number
    investigacaoId?: IntFilter<"RegistroInvestigacao"> | number
    tipo?: StringFilter<"RegistroInvestigacao"> | string
    titulo?: StringFilter<"RegistroInvestigacao"> | string
    pergunta?: StringNullableFilter<"RegistroInvestigacao"> | string | null
    resposta?: StringFilter<"RegistroInvestigacao"> | string
    ordem?: IntFilter<"RegistroInvestigacao"> | number
    createdAt?: DateTimeFilter<"RegistroInvestigacao"> | Date | string
    investigacao?: XOR<InvestigacaoCasoScalarRelationFilter, InvestigacaoCasoWhereInput>
  }

  export type RegistroInvestigacaoOrderByWithRelationInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    tipo?: SortOrder
    titulo?: SortOrder
    pergunta?: SortOrderInput | SortOrder
    resposta?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    investigacao?: InvestigacaoCasoOrderByWithRelationInput
  }

  export type RegistroInvestigacaoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RegistroInvestigacaoWhereInput | RegistroInvestigacaoWhereInput[]
    OR?: RegistroInvestigacaoWhereInput[]
    NOT?: RegistroInvestigacaoWhereInput | RegistroInvestigacaoWhereInput[]
    investigacaoId?: IntFilter<"RegistroInvestigacao"> | number
    tipo?: StringFilter<"RegistroInvestigacao"> | string
    titulo?: StringFilter<"RegistroInvestigacao"> | string
    pergunta?: StringNullableFilter<"RegistroInvestigacao"> | string | null
    resposta?: StringFilter<"RegistroInvestigacao"> | string
    ordem?: IntFilter<"RegistroInvestigacao"> | number
    createdAt?: DateTimeFilter<"RegistroInvestigacao"> | Date | string
    investigacao?: XOR<InvestigacaoCasoScalarRelationFilter, InvestigacaoCasoWhereInput>
  }, "id">

  export type RegistroInvestigacaoOrderByWithAggregationInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    tipo?: SortOrder
    titulo?: SortOrder
    pergunta?: SortOrderInput | SortOrder
    resposta?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    _count?: RegistroInvestigacaoCountOrderByAggregateInput
    _avg?: RegistroInvestigacaoAvgOrderByAggregateInput
    _max?: RegistroInvestigacaoMaxOrderByAggregateInput
    _min?: RegistroInvestigacaoMinOrderByAggregateInput
    _sum?: RegistroInvestigacaoSumOrderByAggregateInput
  }

  export type RegistroInvestigacaoScalarWhereWithAggregatesInput = {
    AND?: RegistroInvestigacaoScalarWhereWithAggregatesInput | RegistroInvestigacaoScalarWhereWithAggregatesInput[]
    OR?: RegistroInvestigacaoScalarWhereWithAggregatesInput[]
    NOT?: RegistroInvestigacaoScalarWhereWithAggregatesInput | RegistroInvestigacaoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RegistroInvestigacao"> | number
    investigacaoId?: IntWithAggregatesFilter<"RegistroInvestigacao"> | number
    tipo?: StringWithAggregatesFilter<"RegistroInvestigacao"> | string
    titulo?: StringWithAggregatesFilter<"RegistroInvestigacao"> | string
    pergunta?: StringNullableWithAggregatesFilter<"RegistroInvestigacao"> | string | null
    resposta?: StringWithAggregatesFilter<"RegistroInvestigacao"> | string
    ordem?: IntWithAggregatesFilter<"RegistroInvestigacao"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RegistroInvestigacao"> | Date | string
  }

  export type UsuarioCreateInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisciplinaCreateInput = {
    nome: string
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutDisciplinasInput
    questoes?: QuestaoCreateNestedManyWithoutDisciplinaInput
  }

  export type DisciplinaUncheckedCreateInput = {
    id?: number
    nome: string
    createdAt?: Date | string
    usuarioId: number
    questoes?: QuestaoUncheckedCreateNestedManyWithoutDisciplinaInput
  }

  export type DisciplinaUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutDisciplinasNestedInput
    questoes?: QuestaoUpdateManyWithoutDisciplinaNestedInput
  }

  export type DisciplinaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    questoes?: QuestaoUncheckedUpdateManyWithoutDisciplinaNestedInput
  }

  export type DisciplinaCreateManyInput = {
    id?: number
    nome: string
    createdAt?: Date | string
    usuarioId: number
  }

  export type DisciplinaUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisciplinaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type QuestaoCreateInput = {
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutQuestoesInput
    disciplina: DisciplinaCreateNestedOneWithoutQuestoesInput
    alternativas?: AlternativaCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUncheckedCreateInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
    disciplinaId: number
    alternativas?: AlternativaUncheckedCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUpdateInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutQuestoesNestedInput
    disciplina?: DisciplinaUpdateOneRequiredWithoutQuestoesNestedInput
    alternativas?: AlternativaUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    disciplinaId?: IntFieldUpdateOperationsInput | number
    alternativas?: AlternativaUncheckedUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoCreateManyInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
    disciplinaId: number
  }

  export type QuestaoUpdateManyMutationInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestaoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    disciplinaId?: IntFieldUpdateOperationsInput | number
  }

  export type AlternativaCreateInput = {
    texto: string
    correta?: boolean
    questao: QuestaoCreateNestedOneWithoutAlternativasInput
  }

  export type AlternativaUncheckedCreateInput = {
    id?: number
    texto: string
    correta?: boolean
    questaoId: number
  }

  export type AlternativaUpdateInput = {
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
    questao?: QuestaoUpdateOneRequiredWithoutAlternativasNestedInput
  }

  export type AlternativaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type AlternativaCreateManyInput = {
    id?: number
    texto: string
    correta?: boolean
    questaoId: number
  }

  export type AlternativaUpdateManyMutationInput = {
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AlternativaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type RespostaCreateInput = {
    correta: boolean
    respondidaAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutRespostasInput
    questao: QuestaoCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    usuarioId: number
    questaoId: number
  }

  export type RespostaUpdateInput = {
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutRespostasNestedInput
    questao?: QuestaoUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type RespostaCreateManyInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    usuarioId: number
    questaoId: number
  }

  export type RespostaUpdateManyMutationInput = {
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type FlashcardCreateInput = {
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutFlashcardsInput
  }

  export type FlashcardUncheckedCreateInput = {
    id?: number
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarioId: number
  }

  export type FlashcardUpdateInput = {
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutFlashcardsNestedInput
  }

  export type FlashcardUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type FlashcardCreateManyInput = {
    id?: number
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarioId: number
  }

  export type FlashcardUpdateManyMutationInput = {
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type MovimentacaoCreateInput = {
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutMovimentacoesInput
  }

  export type MovimentacaoUncheckedCreateInput = {
    id?: number
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
    usuarioId: number
  }

  export type MovimentacaoUpdateInput = {
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutMovimentacoesNestedInput
  }

  export type MovimentacaoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type MovimentacaoCreateManyInput = {
    id?: number
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
    usuarioId: number
  }

  export type MovimentacaoUpdateManyMutationInput = {
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type CasoClinicoCreateInput = {
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autor: UsuarioCreateNestedOneWithoutCasosCriadosInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutCasoInput
    examesCaso?: ExameCasoCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoUncheckedCreateInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autorId: number
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutCasoInput
    examesCaso?: ExameCasoUncheckedCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoUpdateInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autor?: UsuarioUpdateOneRequiredWithoutCasosCriadosNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutCasoNestedInput
    examesCaso?: ExameCasoUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autorId?: IntFieldUpdateOperationsInput | number
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutCasoNestedInput
    examesCaso?: ExameCasoUncheckedUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoCreateManyInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autorId: number
  }

  export type CasoClinicoUpdateManyMutationInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CasoClinicoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autorId?: IntFieldUpdateOperationsInput | number
  }

  export type ExameCasoCreateInput = {
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
    caso: CasoClinicoCreateNestedOneWithoutExamesCasoInput
  }

  export type ExameCasoUncheckedCreateInput = {
    id?: number
    casoId: number
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
  }

  export type ExameCasoUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caso?: CasoClinicoUpdateOneRequiredWithoutExamesCasoNestedInput
  }

  export type ExameCasoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExameCasoCreateManyInput = {
    id?: number
    casoId: number
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
  }

  export type ExameCasoUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExameCasoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigacaoCasoCreateInput = {
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caso: CasoClinicoCreateNestedOneWithoutInvestigacoesInput
    usuario: UsuarioCreateNestedOneWithoutInvestigacoesInput
    registros?: RegistroInvestigacaoCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoUncheckedCreateInput = {
    id?: number
    casoId: number
    usuarioId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    registros?: RegistroInvestigacaoUncheckedCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoUpdateInput = {
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caso?: CasoClinicoUpdateOneRequiredWithoutInvestigacoesNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutInvestigacoesNestedInput
    registros?: RegistroInvestigacaoUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registros?: RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoCreateManyInput = {
    id?: number
    casoId: number
    usuarioId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigacaoCasoUpdateManyMutationInput = {
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigacaoCasoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoCreateInput = {
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
    investigacao: InvestigacaoCasoCreateNestedOneWithoutRegistrosInput
  }

  export type RegistroInvestigacaoUncheckedCreateInput = {
    id?: number
    investigacaoId: number
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
  }

  export type RegistroInvestigacaoUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    investigacao?: InvestigacaoCasoUpdateOneRequiredWithoutRegistrosNestedInput
  }

  export type RegistroInvestigacaoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    investigacaoId?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoCreateManyInput = {
    id?: number
    investigacaoId: number
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
  }

  export type RegistroInvestigacaoUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    investigacaoId?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DisciplinaListRelationFilter = {
    every?: DisciplinaWhereInput
    some?: DisciplinaWhereInput
    none?: DisciplinaWhereInput
  }

  export type QuestaoListRelationFilter = {
    every?: QuestaoWhereInput
    some?: QuestaoWhereInput
    none?: QuestaoWhereInput
  }

  export type RespostaListRelationFilter = {
    every?: RespostaWhereInput
    some?: RespostaWhereInput
    none?: RespostaWhereInput
  }

  export type FlashcardListRelationFilter = {
    every?: FlashcardWhereInput
    some?: FlashcardWhereInput
    none?: FlashcardWhereInput
  }

  export type MovimentacaoListRelationFilter = {
    every?: MovimentacaoWhereInput
    some?: MovimentacaoWhereInput
    none?: MovimentacaoWhereInput
  }

  export type CasoClinicoListRelationFilter = {
    every?: CasoClinicoWhereInput
    some?: CasoClinicoWhereInput
    none?: CasoClinicoWhereInput
  }

  export type InvestigacaoCasoListRelationFilter = {
    every?: InvestigacaoCasoWhereInput
    some?: InvestigacaoCasoWhereInput
    none?: InvestigacaoCasoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DisciplinaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RespostaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlashcardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MovimentacaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CasoClinicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvestigacaoCasoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type DisciplinaCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type DisciplinaAvgOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
  }

  export type DisciplinaMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type DisciplinaMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type DisciplinaSumOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
  }

  export type DisciplinaScalarRelationFilter = {
    is?: DisciplinaWhereInput
    isNot?: DisciplinaWhereInput
  }

  export type AlternativaListRelationFilter = {
    every?: AlternativaWhereInput
    some?: AlternativaWhereInput
    none?: AlternativaWhereInput
  }

  export type AlternativaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestaoCountOrderByAggregateInput = {
    id?: SortOrder
    enunciado?: SortOrder
    explicacao?: SortOrder
    tema?: SortOrder
    dificuldade?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
  }

  export type QuestaoAvgOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
  }

  export type QuestaoMaxOrderByAggregateInput = {
    id?: SortOrder
    enunciado?: SortOrder
    explicacao?: SortOrder
    tema?: SortOrder
    dificuldade?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
  }

  export type QuestaoMinOrderByAggregateInput = {
    id?: SortOrder
    enunciado?: SortOrder
    explicacao?: SortOrder
    tema?: SortOrder
    dificuldade?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
  }

  export type QuestaoSumOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    disciplinaId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type QuestaoScalarRelationFilter = {
    is?: QuestaoWhereInput
    isNot?: QuestaoWhereInput
  }

  export type AlternativaCountOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    correta?: SortOrder
    questaoId?: SortOrder
  }

  export type AlternativaAvgOrderByAggregateInput = {
    id?: SortOrder
    questaoId?: SortOrder
  }

  export type AlternativaMaxOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    correta?: SortOrder
    questaoId?: SortOrder
  }

  export type AlternativaMinOrderByAggregateInput = {
    id?: SortOrder
    texto?: SortOrder
    correta?: SortOrder
    questaoId?: SortOrder
  }

  export type AlternativaSumOrderByAggregateInput = {
    id?: SortOrder
    questaoId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RespostaCountOrderByAggregateInput = {
    id?: SortOrder
    correta?: SortOrder
    respondidaAt?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
  }

  export type RespostaAvgOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
  }

  export type RespostaMaxOrderByAggregateInput = {
    id?: SortOrder
    correta?: SortOrder
    respondidaAt?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
  }

  export type RespostaMinOrderByAggregateInput = {
    id?: SortOrder
    correta?: SortOrder
    respondidaAt?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
  }

  export type RespostaSumOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
    questaoId?: SortOrder
  }

  export type FlashcardCountOrderByAggregateInput = {
    id?: SortOrder
    frente?: SortOrder
    verso?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type FlashcardAvgOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
  }

  export type FlashcardMaxOrderByAggregateInput = {
    id?: SortOrder
    frente?: SortOrder
    verso?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type FlashcardMinOrderByAggregateInput = {
    id?: SortOrder
    frente?: SortOrder
    verso?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type FlashcardSumOrderByAggregateInput = {
    id?: SortOrder
    usuarioId?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumTipoMovimentacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoMovimentacao | EnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoMovimentacaoFilter<$PrismaModel> | $Enums.TipoMovimentacao
  }

  export type MovimentacaoCountOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type MovimentacaoAvgOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    usuarioId?: SortOrder
  }

  export type MovimentacaoMaxOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type MovimentacaoMinOrderByAggregateInput = {
    id?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    usuarioId?: SortOrder
  }

  export type MovimentacaoSumOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    usuarioId?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumTipoMovimentacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoMovimentacao | EnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoMovimentacaoWithAggregatesFilter<$PrismaModel> | $Enums.TipoMovimentacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoMovimentacaoFilter<$PrismaModel>
    _max?: NestedEnumTipoMovimentacaoFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ExameCasoListRelationFilter = {
    every?: ExameCasoWhereInput
    some?: ExameCasoWhereInput
    none?: ExameCasoWhereInput
  }

  export type ExameCasoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CasoClinicoCountOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    area?: SortOrder
    especialidade?: SortOrder
    dificuldade?: SortOrder
    cenario?: SortOrder
    queixaInicial?: SortOrder
    dadosIniciais?: SortOrder
    anamnese?: SortOrder
    exameFisico?: SortOrder
    sinaisVitais?: SortOrder
    exames?: SortOrder
    evolucao?: SortOrder
    diagnosticoFinal?: SortOrder
    explicacaoDiagnostico?: SortOrder
    diagnosticosDiferenciais?: SortOrder
    pontosChave?: SortOrder
    publicado?: SortOrder
    geradoPorIA?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    autorId?: SortOrder
  }

  export type CasoClinicoAvgOrderByAggregateInput = {
    id?: SortOrder
    autorId?: SortOrder
  }

  export type CasoClinicoMaxOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    area?: SortOrder
    especialidade?: SortOrder
    dificuldade?: SortOrder
    cenario?: SortOrder
    queixaInicial?: SortOrder
    diagnosticoFinal?: SortOrder
    explicacaoDiagnostico?: SortOrder
    publicado?: SortOrder
    geradoPorIA?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    autorId?: SortOrder
  }

  export type CasoClinicoMinOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    area?: SortOrder
    especialidade?: SortOrder
    dificuldade?: SortOrder
    cenario?: SortOrder
    queixaInicial?: SortOrder
    diagnosticoFinal?: SortOrder
    explicacaoDiagnostico?: SortOrder
    publicado?: SortOrder
    geradoPorIA?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    autorId?: SortOrder
  }

  export type CasoClinicoSumOrderByAggregateInput = {
    id?: SortOrder
    autorId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type CasoClinicoScalarRelationFilter = {
    is?: CasoClinicoWhereInput
    isNot?: CasoClinicoWhereInput
  }

  export type ExameCasoCountOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    nome?: SortOrder
    categoria?: SortOrder
    resultado?: SortOrder
    interpretacao?: SortOrder
    disponivel?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type ExameCasoAvgOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    ordem?: SortOrder
  }

  export type ExameCasoMaxOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    nome?: SortOrder
    categoria?: SortOrder
    resultado?: SortOrder
    interpretacao?: SortOrder
    disponivel?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type ExameCasoMinOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    nome?: SortOrder
    categoria?: SortOrder
    resultado?: SortOrder
    interpretacao?: SortOrder
    disponivel?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type ExameCasoSumOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    ordem?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RegistroInvestigacaoListRelationFilter = {
    every?: RegistroInvestigacaoWhereInput
    some?: RegistroInvestigacaoWhereInput
    none?: RegistroInvestigacaoWhereInput
  }

  export type RegistroInvestigacaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvestigacaoCasoCasoIdUsuarioIdCompoundUniqueInput = {
    casoId: number
    usuarioId: number
  }

  export type InvestigacaoCasoCountOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
    status?: SortOrder
    informacoesColetadas?: SortOrder
    hipotese?: SortOrder
    justificativa?: SortOrder
    avaliacao?: SortOrder
    finalizado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigacaoCasoAvgOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
  }

  export type InvestigacaoCasoMaxOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
    status?: SortOrder
    hipotese?: SortOrder
    justificativa?: SortOrder
    finalizado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigacaoCasoMinOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
    status?: SortOrder
    hipotese?: SortOrder
    justificativa?: SortOrder
    finalizado?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvestigacaoCasoSumOrderByAggregateInput = {
    id?: SortOrder
    casoId?: SortOrder
    usuarioId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type InvestigacaoCasoScalarRelationFilter = {
    is?: InvestigacaoCasoWhereInput
    isNot?: InvestigacaoCasoWhereInput
  }

  export type RegistroInvestigacaoCountOrderByAggregateInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    tipo?: SortOrder
    titulo?: SortOrder
    pergunta?: SortOrder
    resposta?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type RegistroInvestigacaoAvgOrderByAggregateInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    ordem?: SortOrder
  }

  export type RegistroInvestigacaoMaxOrderByAggregateInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    tipo?: SortOrder
    titulo?: SortOrder
    pergunta?: SortOrder
    resposta?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type RegistroInvestigacaoMinOrderByAggregateInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    tipo?: SortOrder
    titulo?: SortOrder
    pergunta?: SortOrder
    resposta?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
  }

  export type RegistroInvestigacaoSumOrderByAggregateInput = {
    id?: SortOrder
    investigacaoId?: SortOrder
    ordem?: SortOrder
  }

  export type DisciplinaCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput> | DisciplinaCreateWithoutUsuarioInput[] | DisciplinaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: DisciplinaCreateOrConnectWithoutUsuarioInput | DisciplinaCreateOrConnectWithoutUsuarioInput[]
    createMany?: DisciplinaCreateManyUsuarioInputEnvelope
    connect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
  }

  export type QuestaoCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput> | QuestaoCreateWithoutUsuarioInput[] | QuestaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutUsuarioInput | QuestaoCreateOrConnectWithoutUsuarioInput[]
    createMany?: QuestaoCreateManyUsuarioInputEnvelope
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
  }

  export type RespostaCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type FlashcardCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput> | FlashcardCreateWithoutUsuarioInput[] | FlashcardUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUsuarioInput | FlashcardCreateOrConnectWithoutUsuarioInput[]
    createMany?: FlashcardCreateManyUsuarioInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type MovimentacaoCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput> | MovimentacaoCreateWithoutUsuarioInput[] | MovimentacaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutUsuarioInput | MovimentacaoCreateOrConnectWithoutUsuarioInput[]
    createMany?: MovimentacaoCreateManyUsuarioInputEnvelope
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
  }

  export type CasoClinicoCreateNestedManyWithoutAutorInput = {
    create?: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput> | CasoClinicoCreateWithoutAutorInput[] | CasoClinicoUncheckedCreateWithoutAutorInput[]
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutAutorInput | CasoClinicoCreateOrConnectWithoutAutorInput[]
    createMany?: CasoClinicoCreateManyAutorInputEnvelope
    connect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
  }

  export type InvestigacaoCasoCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput> | InvestigacaoCasoCreateWithoutUsuarioInput[] | InvestigacaoCasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutUsuarioInput | InvestigacaoCasoCreateOrConnectWithoutUsuarioInput[]
    createMany?: InvestigacaoCasoCreateManyUsuarioInputEnvelope
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
  }

  export type DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput> | DisciplinaCreateWithoutUsuarioInput[] | DisciplinaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: DisciplinaCreateOrConnectWithoutUsuarioInput | DisciplinaCreateOrConnectWithoutUsuarioInput[]
    createMany?: DisciplinaCreateManyUsuarioInputEnvelope
    connect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
  }

  export type QuestaoUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput> | QuestaoCreateWithoutUsuarioInput[] | QuestaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutUsuarioInput | QuestaoCreateOrConnectWithoutUsuarioInput[]
    createMany?: QuestaoCreateManyUsuarioInputEnvelope
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type FlashcardUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput> | FlashcardCreateWithoutUsuarioInput[] | FlashcardUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUsuarioInput | FlashcardCreateOrConnectWithoutUsuarioInput[]
    createMany?: FlashcardCreateManyUsuarioInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput> | MovimentacaoCreateWithoutUsuarioInput[] | MovimentacaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutUsuarioInput | MovimentacaoCreateOrConnectWithoutUsuarioInput[]
    createMany?: MovimentacaoCreateManyUsuarioInputEnvelope
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
  }

  export type CasoClinicoUncheckedCreateNestedManyWithoutAutorInput = {
    create?: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput> | CasoClinicoCreateWithoutAutorInput[] | CasoClinicoUncheckedCreateWithoutAutorInput[]
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutAutorInput | CasoClinicoCreateOrConnectWithoutAutorInput[]
    createMany?: CasoClinicoCreateManyAutorInputEnvelope
    connect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
  }

  export type InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput> | InvestigacaoCasoCreateWithoutUsuarioInput[] | InvestigacaoCasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutUsuarioInput | InvestigacaoCasoCreateOrConnectWithoutUsuarioInput[]
    createMany?: InvestigacaoCasoCreateManyUsuarioInputEnvelope
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DisciplinaUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput> | DisciplinaCreateWithoutUsuarioInput[] | DisciplinaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: DisciplinaCreateOrConnectWithoutUsuarioInput | DisciplinaCreateOrConnectWithoutUsuarioInput[]
    upsert?: DisciplinaUpsertWithWhereUniqueWithoutUsuarioInput | DisciplinaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: DisciplinaCreateManyUsuarioInputEnvelope
    set?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    disconnect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    delete?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    connect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    update?: DisciplinaUpdateWithWhereUniqueWithoutUsuarioInput | DisciplinaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: DisciplinaUpdateManyWithWhereWithoutUsuarioInput | DisciplinaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: DisciplinaScalarWhereInput | DisciplinaScalarWhereInput[]
  }

  export type QuestaoUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput> | QuestaoCreateWithoutUsuarioInput[] | QuestaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutUsuarioInput | QuestaoCreateOrConnectWithoutUsuarioInput[]
    upsert?: QuestaoUpsertWithWhereUniqueWithoutUsuarioInput | QuestaoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: QuestaoCreateManyUsuarioInputEnvelope
    set?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    disconnect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    delete?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    update?: QuestaoUpdateWithWhereUniqueWithoutUsuarioInput | QuestaoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: QuestaoUpdateManyWithWhereWithoutUsuarioInput | QuestaoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
  }

  export type RespostaUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutUsuarioInput | RespostaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutUsuarioInput | RespostaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutUsuarioInput | RespostaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type FlashcardUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput> | FlashcardCreateWithoutUsuarioInput[] | FlashcardUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUsuarioInput | FlashcardCreateOrConnectWithoutUsuarioInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutUsuarioInput | FlashcardUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: FlashcardCreateManyUsuarioInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutUsuarioInput | FlashcardUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutUsuarioInput | FlashcardUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type MovimentacaoUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput> | MovimentacaoCreateWithoutUsuarioInput[] | MovimentacaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutUsuarioInput | MovimentacaoCreateOrConnectWithoutUsuarioInput[]
    upsert?: MovimentacaoUpsertWithWhereUniqueWithoutUsuarioInput | MovimentacaoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: MovimentacaoCreateManyUsuarioInputEnvelope
    set?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    disconnect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    delete?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    update?: MovimentacaoUpdateWithWhereUniqueWithoutUsuarioInput | MovimentacaoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: MovimentacaoUpdateManyWithWhereWithoutUsuarioInput | MovimentacaoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
  }

  export type CasoClinicoUpdateManyWithoutAutorNestedInput = {
    create?: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput> | CasoClinicoCreateWithoutAutorInput[] | CasoClinicoUncheckedCreateWithoutAutorInput[]
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutAutorInput | CasoClinicoCreateOrConnectWithoutAutorInput[]
    upsert?: CasoClinicoUpsertWithWhereUniqueWithoutAutorInput | CasoClinicoUpsertWithWhereUniqueWithoutAutorInput[]
    createMany?: CasoClinicoCreateManyAutorInputEnvelope
    set?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    disconnect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    delete?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    connect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    update?: CasoClinicoUpdateWithWhereUniqueWithoutAutorInput | CasoClinicoUpdateWithWhereUniqueWithoutAutorInput[]
    updateMany?: CasoClinicoUpdateManyWithWhereWithoutAutorInput | CasoClinicoUpdateManyWithWhereWithoutAutorInput[]
    deleteMany?: CasoClinicoScalarWhereInput | CasoClinicoScalarWhereInput[]
  }

  export type InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput> | InvestigacaoCasoCreateWithoutUsuarioInput[] | InvestigacaoCasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutUsuarioInput | InvestigacaoCasoCreateOrConnectWithoutUsuarioInput[]
    upsert?: InvestigacaoCasoUpsertWithWhereUniqueWithoutUsuarioInput | InvestigacaoCasoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: InvestigacaoCasoCreateManyUsuarioInputEnvelope
    set?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    disconnect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    delete?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    update?: InvestigacaoCasoUpdateWithWhereUniqueWithoutUsuarioInput | InvestigacaoCasoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: InvestigacaoCasoUpdateManyWithWhereWithoutUsuarioInput | InvestigacaoCasoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput> | DisciplinaCreateWithoutUsuarioInput[] | DisciplinaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: DisciplinaCreateOrConnectWithoutUsuarioInput | DisciplinaCreateOrConnectWithoutUsuarioInput[]
    upsert?: DisciplinaUpsertWithWhereUniqueWithoutUsuarioInput | DisciplinaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: DisciplinaCreateManyUsuarioInputEnvelope
    set?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    disconnect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    delete?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    connect?: DisciplinaWhereUniqueInput | DisciplinaWhereUniqueInput[]
    update?: DisciplinaUpdateWithWhereUniqueWithoutUsuarioInput | DisciplinaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: DisciplinaUpdateManyWithWhereWithoutUsuarioInput | DisciplinaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: DisciplinaScalarWhereInput | DisciplinaScalarWhereInput[]
  }

  export type QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput> | QuestaoCreateWithoutUsuarioInput[] | QuestaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutUsuarioInput | QuestaoCreateOrConnectWithoutUsuarioInput[]
    upsert?: QuestaoUpsertWithWhereUniqueWithoutUsuarioInput | QuestaoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: QuestaoCreateManyUsuarioInputEnvelope
    set?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    disconnect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    delete?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    update?: QuestaoUpdateWithWhereUniqueWithoutUsuarioInput | QuestaoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: QuestaoUpdateManyWithWhereWithoutUsuarioInput | QuestaoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput> | RespostaCreateWithoutUsuarioInput[] | RespostaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutUsuarioInput | RespostaCreateOrConnectWithoutUsuarioInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutUsuarioInput | RespostaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: RespostaCreateManyUsuarioInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutUsuarioInput | RespostaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutUsuarioInput | RespostaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput> | FlashcardCreateWithoutUsuarioInput[] | FlashcardUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutUsuarioInput | FlashcardCreateOrConnectWithoutUsuarioInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutUsuarioInput | FlashcardUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: FlashcardCreateManyUsuarioInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutUsuarioInput | FlashcardUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutUsuarioInput | FlashcardUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput> | MovimentacaoCreateWithoutUsuarioInput[] | MovimentacaoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutUsuarioInput | MovimentacaoCreateOrConnectWithoutUsuarioInput[]
    upsert?: MovimentacaoUpsertWithWhereUniqueWithoutUsuarioInput | MovimentacaoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: MovimentacaoCreateManyUsuarioInputEnvelope
    set?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    disconnect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    delete?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    update?: MovimentacaoUpdateWithWhereUniqueWithoutUsuarioInput | MovimentacaoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: MovimentacaoUpdateManyWithWhereWithoutUsuarioInput | MovimentacaoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
  }

  export type CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput = {
    create?: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput> | CasoClinicoCreateWithoutAutorInput[] | CasoClinicoUncheckedCreateWithoutAutorInput[]
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutAutorInput | CasoClinicoCreateOrConnectWithoutAutorInput[]
    upsert?: CasoClinicoUpsertWithWhereUniqueWithoutAutorInput | CasoClinicoUpsertWithWhereUniqueWithoutAutorInput[]
    createMany?: CasoClinicoCreateManyAutorInputEnvelope
    set?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    disconnect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    delete?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    connect?: CasoClinicoWhereUniqueInput | CasoClinicoWhereUniqueInput[]
    update?: CasoClinicoUpdateWithWhereUniqueWithoutAutorInput | CasoClinicoUpdateWithWhereUniqueWithoutAutorInput[]
    updateMany?: CasoClinicoUpdateManyWithWhereWithoutAutorInput | CasoClinicoUpdateManyWithWhereWithoutAutorInput[]
    deleteMany?: CasoClinicoScalarWhereInput | CasoClinicoScalarWhereInput[]
  }

  export type InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput> | InvestigacaoCasoCreateWithoutUsuarioInput[] | InvestigacaoCasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutUsuarioInput | InvestigacaoCasoCreateOrConnectWithoutUsuarioInput[]
    upsert?: InvestigacaoCasoUpsertWithWhereUniqueWithoutUsuarioInput | InvestigacaoCasoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: InvestigacaoCasoCreateManyUsuarioInputEnvelope
    set?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    disconnect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    delete?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    update?: InvestigacaoCasoUpdateWithWhereUniqueWithoutUsuarioInput | InvestigacaoCasoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: InvestigacaoCasoUpdateManyWithWhereWithoutUsuarioInput | InvestigacaoCasoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutDisciplinasInput = {
    create?: XOR<UsuarioCreateWithoutDisciplinasInput, UsuarioUncheckedCreateWithoutDisciplinasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutDisciplinasInput
    connect?: UsuarioWhereUniqueInput
  }

  export type QuestaoCreateNestedManyWithoutDisciplinaInput = {
    create?: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput> | QuestaoCreateWithoutDisciplinaInput[] | QuestaoUncheckedCreateWithoutDisciplinaInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutDisciplinaInput | QuestaoCreateOrConnectWithoutDisciplinaInput[]
    createMany?: QuestaoCreateManyDisciplinaInputEnvelope
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
  }

  export type QuestaoUncheckedCreateNestedManyWithoutDisciplinaInput = {
    create?: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput> | QuestaoCreateWithoutDisciplinaInput[] | QuestaoUncheckedCreateWithoutDisciplinaInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutDisciplinaInput | QuestaoCreateOrConnectWithoutDisciplinaInput[]
    createMany?: QuestaoCreateManyDisciplinaInputEnvelope
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutDisciplinasNestedInput = {
    create?: XOR<UsuarioCreateWithoutDisciplinasInput, UsuarioUncheckedCreateWithoutDisciplinasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutDisciplinasInput
    upsert?: UsuarioUpsertWithoutDisciplinasInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutDisciplinasInput, UsuarioUpdateWithoutDisciplinasInput>, UsuarioUncheckedUpdateWithoutDisciplinasInput>
  }

  export type QuestaoUpdateManyWithoutDisciplinaNestedInput = {
    create?: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput> | QuestaoCreateWithoutDisciplinaInput[] | QuestaoUncheckedCreateWithoutDisciplinaInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutDisciplinaInput | QuestaoCreateOrConnectWithoutDisciplinaInput[]
    upsert?: QuestaoUpsertWithWhereUniqueWithoutDisciplinaInput | QuestaoUpsertWithWhereUniqueWithoutDisciplinaInput[]
    createMany?: QuestaoCreateManyDisciplinaInputEnvelope
    set?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    disconnect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    delete?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    update?: QuestaoUpdateWithWhereUniqueWithoutDisciplinaInput | QuestaoUpdateWithWhereUniqueWithoutDisciplinaInput[]
    updateMany?: QuestaoUpdateManyWithWhereWithoutDisciplinaInput | QuestaoUpdateManyWithWhereWithoutDisciplinaInput[]
    deleteMany?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
  }

  export type QuestaoUncheckedUpdateManyWithoutDisciplinaNestedInput = {
    create?: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput> | QuestaoCreateWithoutDisciplinaInput[] | QuestaoUncheckedCreateWithoutDisciplinaInput[]
    connectOrCreate?: QuestaoCreateOrConnectWithoutDisciplinaInput | QuestaoCreateOrConnectWithoutDisciplinaInput[]
    upsert?: QuestaoUpsertWithWhereUniqueWithoutDisciplinaInput | QuestaoUpsertWithWhereUniqueWithoutDisciplinaInput[]
    createMany?: QuestaoCreateManyDisciplinaInputEnvelope
    set?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    disconnect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    delete?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    connect?: QuestaoWhereUniqueInput | QuestaoWhereUniqueInput[]
    update?: QuestaoUpdateWithWhereUniqueWithoutDisciplinaInput | QuestaoUpdateWithWhereUniqueWithoutDisciplinaInput[]
    updateMany?: QuestaoUpdateManyWithWhereWithoutDisciplinaInput | QuestaoUpdateManyWithWhereWithoutDisciplinaInput[]
    deleteMany?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutQuestoesInput = {
    create?: XOR<UsuarioCreateWithoutQuestoesInput, UsuarioUncheckedCreateWithoutQuestoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutQuestoesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type DisciplinaCreateNestedOneWithoutQuestoesInput = {
    create?: XOR<DisciplinaCreateWithoutQuestoesInput, DisciplinaUncheckedCreateWithoutQuestoesInput>
    connectOrCreate?: DisciplinaCreateOrConnectWithoutQuestoesInput
    connect?: DisciplinaWhereUniqueInput
  }

  export type AlternativaCreateNestedManyWithoutQuestaoInput = {
    create?: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput> | AlternativaCreateWithoutQuestaoInput[] | AlternativaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: AlternativaCreateOrConnectWithoutQuestaoInput | AlternativaCreateOrConnectWithoutQuestaoInput[]
    createMany?: AlternativaCreateManyQuestaoInputEnvelope
    connect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
  }

  export type RespostaCreateNestedManyWithoutQuestaoInput = {
    create?: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput> | RespostaCreateWithoutQuestaoInput[] | RespostaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutQuestaoInput | RespostaCreateOrConnectWithoutQuestaoInput[]
    createMany?: RespostaCreateManyQuestaoInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type AlternativaUncheckedCreateNestedManyWithoutQuestaoInput = {
    create?: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput> | AlternativaCreateWithoutQuestaoInput[] | AlternativaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: AlternativaCreateOrConnectWithoutQuestaoInput | AlternativaCreateOrConnectWithoutQuestaoInput[]
    createMany?: AlternativaCreateManyQuestaoInputEnvelope
    connect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutQuestaoInput = {
    create?: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput> | RespostaCreateWithoutQuestaoInput[] | RespostaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutQuestaoInput | RespostaCreateOrConnectWithoutQuestaoInput[]
    createMany?: RespostaCreateManyQuestaoInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutQuestoesNestedInput = {
    create?: XOR<UsuarioCreateWithoutQuestoesInput, UsuarioUncheckedCreateWithoutQuestoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutQuestoesInput
    upsert?: UsuarioUpsertWithoutQuestoesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutQuestoesInput, UsuarioUpdateWithoutQuestoesInput>, UsuarioUncheckedUpdateWithoutQuestoesInput>
  }

  export type DisciplinaUpdateOneRequiredWithoutQuestoesNestedInput = {
    create?: XOR<DisciplinaCreateWithoutQuestoesInput, DisciplinaUncheckedCreateWithoutQuestoesInput>
    connectOrCreate?: DisciplinaCreateOrConnectWithoutQuestoesInput
    upsert?: DisciplinaUpsertWithoutQuestoesInput
    connect?: DisciplinaWhereUniqueInput
    update?: XOR<XOR<DisciplinaUpdateToOneWithWhereWithoutQuestoesInput, DisciplinaUpdateWithoutQuestoesInput>, DisciplinaUncheckedUpdateWithoutQuestoesInput>
  }

  export type AlternativaUpdateManyWithoutQuestaoNestedInput = {
    create?: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput> | AlternativaCreateWithoutQuestaoInput[] | AlternativaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: AlternativaCreateOrConnectWithoutQuestaoInput | AlternativaCreateOrConnectWithoutQuestaoInput[]
    upsert?: AlternativaUpsertWithWhereUniqueWithoutQuestaoInput | AlternativaUpsertWithWhereUniqueWithoutQuestaoInput[]
    createMany?: AlternativaCreateManyQuestaoInputEnvelope
    set?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    disconnect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    delete?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    connect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    update?: AlternativaUpdateWithWhereUniqueWithoutQuestaoInput | AlternativaUpdateWithWhereUniqueWithoutQuestaoInput[]
    updateMany?: AlternativaUpdateManyWithWhereWithoutQuestaoInput | AlternativaUpdateManyWithWhereWithoutQuestaoInput[]
    deleteMany?: AlternativaScalarWhereInput | AlternativaScalarWhereInput[]
  }

  export type RespostaUpdateManyWithoutQuestaoNestedInput = {
    create?: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput> | RespostaCreateWithoutQuestaoInput[] | RespostaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutQuestaoInput | RespostaCreateOrConnectWithoutQuestaoInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutQuestaoInput | RespostaUpsertWithWhereUniqueWithoutQuestaoInput[]
    createMany?: RespostaCreateManyQuestaoInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutQuestaoInput | RespostaUpdateWithWhereUniqueWithoutQuestaoInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutQuestaoInput | RespostaUpdateManyWithWhereWithoutQuestaoInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type AlternativaUncheckedUpdateManyWithoutQuestaoNestedInput = {
    create?: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput> | AlternativaCreateWithoutQuestaoInput[] | AlternativaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: AlternativaCreateOrConnectWithoutQuestaoInput | AlternativaCreateOrConnectWithoutQuestaoInput[]
    upsert?: AlternativaUpsertWithWhereUniqueWithoutQuestaoInput | AlternativaUpsertWithWhereUniqueWithoutQuestaoInput[]
    createMany?: AlternativaCreateManyQuestaoInputEnvelope
    set?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    disconnect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    delete?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    connect?: AlternativaWhereUniqueInput | AlternativaWhereUniqueInput[]
    update?: AlternativaUpdateWithWhereUniqueWithoutQuestaoInput | AlternativaUpdateWithWhereUniqueWithoutQuestaoInput[]
    updateMany?: AlternativaUpdateManyWithWhereWithoutQuestaoInput | AlternativaUpdateManyWithWhereWithoutQuestaoInput[]
    deleteMany?: AlternativaScalarWhereInput | AlternativaScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutQuestaoNestedInput = {
    create?: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput> | RespostaCreateWithoutQuestaoInput[] | RespostaUncheckedCreateWithoutQuestaoInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutQuestaoInput | RespostaCreateOrConnectWithoutQuestaoInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutQuestaoInput | RespostaUpsertWithWhereUniqueWithoutQuestaoInput[]
    createMany?: RespostaCreateManyQuestaoInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutQuestaoInput | RespostaUpdateWithWhereUniqueWithoutQuestaoInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutQuestaoInput | RespostaUpdateManyWithWhereWithoutQuestaoInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type QuestaoCreateNestedOneWithoutAlternativasInput = {
    create?: XOR<QuestaoCreateWithoutAlternativasInput, QuestaoUncheckedCreateWithoutAlternativasInput>
    connectOrCreate?: QuestaoCreateOrConnectWithoutAlternativasInput
    connect?: QuestaoWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type QuestaoUpdateOneRequiredWithoutAlternativasNestedInput = {
    create?: XOR<QuestaoCreateWithoutAlternativasInput, QuestaoUncheckedCreateWithoutAlternativasInput>
    connectOrCreate?: QuestaoCreateOrConnectWithoutAlternativasInput
    upsert?: QuestaoUpsertWithoutAlternativasInput
    connect?: QuestaoWhereUniqueInput
    update?: XOR<XOR<QuestaoUpdateToOneWithWhereWithoutAlternativasInput, QuestaoUpdateWithoutAlternativasInput>, QuestaoUncheckedUpdateWithoutAlternativasInput>
  }

  export type UsuarioCreateNestedOneWithoutRespostasInput = {
    create?: XOR<UsuarioCreateWithoutRespostasInput, UsuarioUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutRespostasInput
    connect?: UsuarioWhereUniqueInput
  }

  export type QuestaoCreateNestedOneWithoutRespostasInput = {
    create?: XOR<QuestaoCreateWithoutRespostasInput, QuestaoUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: QuestaoCreateOrConnectWithoutRespostasInput
    connect?: QuestaoWhereUniqueInput
  }

  export type UsuarioUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<UsuarioCreateWithoutRespostasInput, UsuarioUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutRespostasInput
    upsert?: UsuarioUpsertWithoutRespostasInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutRespostasInput, UsuarioUpdateWithoutRespostasInput>, UsuarioUncheckedUpdateWithoutRespostasInput>
  }

  export type QuestaoUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<QuestaoCreateWithoutRespostasInput, QuestaoUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: QuestaoCreateOrConnectWithoutRespostasInput
    upsert?: QuestaoUpsertWithoutRespostasInput
    connect?: QuestaoWhereUniqueInput
    update?: XOR<XOR<QuestaoUpdateToOneWithWhereWithoutRespostasInput, QuestaoUpdateWithoutRespostasInput>, QuestaoUncheckedUpdateWithoutRespostasInput>
  }

  export type UsuarioCreateNestedOneWithoutFlashcardsInput = {
    create?: XOR<UsuarioCreateWithoutFlashcardsInput, UsuarioUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutFlashcardsInput
    connect?: UsuarioWhereUniqueInput
  }

  export type UsuarioUpdateOneRequiredWithoutFlashcardsNestedInput = {
    create?: XOR<UsuarioCreateWithoutFlashcardsInput, UsuarioUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutFlashcardsInput
    upsert?: UsuarioUpsertWithoutFlashcardsInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutFlashcardsInput, UsuarioUpdateWithoutFlashcardsInput>, UsuarioUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UsuarioCreateNestedOneWithoutMovimentacoesInput = {
    create?: XOR<UsuarioCreateWithoutMovimentacoesInput, UsuarioUncheckedCreateWithoutMovimentacoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMovimentacoesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumTipoMovimentacaoFieldUpdateOperationsInput = {
    set?: $Enums.TipoMovimentacao
  }

  export type UsuarioUpdateOneRequiredWithoutMovimentacoesNestedInput = {
    create?: XOR<UsuarioCreateWithoutMovimentacoesInput, UsuarioUncheckedCreateWithoutMovimentacoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutMovimentacoesInput
    upsert?: UsuarioUpsertWithoutMovimentacoesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutMovimentacoesInput, UsuarioUpdateWithoutMovimentacoesInput>, UsuarioUncheckedUpdateWithoutMovimentacoesInput>
  }

  export type UsuarioCreateNestedOneWithoutCasosCriadosInput = {
    create?: XOR<UsuarioCreateWithoutCasosCriadosInput, UsuarioUncheckedCreateWithoutCasosCriadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutCasosCriadosInput
    connect?: UsuarioWhereUniqueInput
  }

  export type InvestigacaoCasoCreateNestedManyWithoutCasoInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput> | InvestigacaoCasoCreateWithoutCasoInput[] | InvestigacaoCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutCasoInput | InvestigacaoCasoCreateOrConnectWithoutCasoInput[]
    createMany?: InvestigacaoCasoCreateManyCasoInputEnvelope
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
  }

  export type ExameCasoCreateNestedManyWithoutCasoInput = {
    create?: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput> | ExameCasoCreateWithoutCasoInput[] | ExameCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: ExameCasoCreateOrConnectWithoutCasoInput | ExameCasoCreateOrConnectWithoutCasoInput[]
    createMany?: ExameCasoCreateManyCasoInputEnvelope
    connect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
  }

  export type InvestigacaoCasoUncheckedCreateNestedManyWithoutCasoInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput> | InvestigacaoCasoCreateWithoutCasoInput[] | InvestigacaoCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutCasoInput | InvestigacaoCasoCreateOrConnectWithoutCasoInput[]
    createMany?: InvestigacaoCasoCreateManyCasoInputEnvelope
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
  }

  export type ExameCasoUncheckedCreateNestedManyWithoutCasoInput = {
    create?: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput> | ExameCasoCreateWithoutCasoInput[] | ExameCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: ExameCasoCreateOrConnectWithoutCasoInput | ExameCasoCreateOrConnectWithoutCasoInput[]
    createMany?: ExameCasoCreateManyCasoInputEnvelope
    connect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutCasosCriadosNestedInput = {
    create?: XOR<UsuarioCreateWithoutCasosCriadosInput, UsuarioUncheckedCreateWithoutCasosCriadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutCasosCriadosInput
    upsert?: UsuarioUpsertWithoutCasosCriadosInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutCasosCriadosInput, UsuarioUpdateWithoutCasosCriadosInput>, UsuarioUncheckedUpdateWithoutCasosCriadosInput>
  }

  export type InvestigacaoCasoUpdateManyWithoutCasoNestedInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput> | InvestigacaoCasoCreateWithoutCasoInput[] | InvestigacaoCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutCasoInput | InvestigacaoCasoCreateOrConnectWithoutCasoInput[]
    upsert?: InvestigacaoCasoUpsertWithWhereUniqueWithoutCasoInput | InvestigacaoCasoUpsertWithWhereUniqueWithoutCasoInput[]
    createMany?: InvestigacaoCasoCreateManyCasoInputEnvelope
    set?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    disconnect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    delete?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    update?: InvestigacaoCasoUpdateWithWhereUniqueWithoutCasoInput | InvestigacaoCasoUpdateWithWhereUniqueWithoutCasoInput[]
    updateMany?: InvestigacaoCasoUpdateManyWithWhereWithoutCasoInput | InvestigacaoCasoUpdateManyWithWhereWithoutCasoInput[]
    deleteMany?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
  }

  export type ExameCasoUpdateManyWithoutCasoNestedInput = {
    create?: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput> | ExameCasoCreateWithoutCasoInput[] | ExameCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: ExameCasoCreateOrConnectWithoutCasoInput | ExameCasoCreateOrConnectWithoutCasoInput[]
    upsert?: ExameCasoUpsertWithWhereUniqueWithoutCasoInput | ExameCasoUpsertWithWhereUniqueWithoutCasoInput[]
    createMany?: ExameCasoCreateManyCasoInputEnvelope
    set?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    disconnect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    delete?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    connect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    update?: ExameCasoUpdateWithWhereUniqueWithoutCasoInput | ExameCasoUpdateWithWhereUniqueWithoutCasoInput[]
    updateMany?: ExameCasoUpdateManyWithWhereWithoutCasoInput | ExameCasoUpdateManyWithWhereWithoutCasoInput[]
    deleteMany?: ExameCasoScalarWhereInput | ExameCasoScalarWhereInput[]
  }

  export type InvestigacaoCasoUncheckedUpdateManyWithoutCasoNestedInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput> | InvestigacaoCasoCreateWithoutCasoInput[] | InvestigacaoCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutCasoInput | InvestigacaoCasoCreateOrConnectWithoutCasoInput[]
    upsert?: InvestigacaoCasoUpsertWithWhereUniqueWithoutCasoInput | InvestigacaoCasoUpsertWithWhereUniqueWithoutCasoInput[]
    createMany?: InvestigacaoCasoCreateManyCasoInputEnvelope
    set?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    disconnect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    delete?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    connect?: InvestigacaoCasoWhereUniqueInput | InvestigacaoCasoWhereUniqueInput[]
    update?: InvestigacaoCasoUpdateWithWhereUniqueWithoutCasoInput | InvestigacaoCasoUpdateWithWhereUniqueWithoutCasoInput[]
    updateMany?: InvestigacaoCasoUpdateManyWithWhereWithoutCasoInput | InvestigacaoCasoUpdateManyWithWhereWithoutCasoInput[]
    deleteMany?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
  }

  export type ExameCasoUncheckedUpdateManyWithoutCasoNestedInput = {
    create?: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput> | ExameCasoCreateWithoutCasoInput[] | ExameCasoUncheckedCreateWithoutCasoInput[]
    connectOrCreate?: ExameCasoCreateOrConnectWithoutCasoInput | ExameCasoCreateOrConnectWithoutCasoInput[]
    upsert?: ExameCasoUpsertWithWhereUniqueWithoutCasoInput | ExameCasoUpsertWithWhereUniqueWithoutCasoInput[]
    createMany?: ExameCasoCreateManyCasoInputEnvelope
    set?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    disconnect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    delete?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    connect?: ExameCasoWhereUniqueInput | ExameCasoWhereUniqueInput[]
    update?: ExameCasoUpdateWithWhereUniqueWithoutCasoInput | ExameCasoUpdateWithWhereUniqueWithoutCasoInput[]
    updateMany?: ExameCasoUpdateManyWithWhereWithoutCasoInput | ExameCasoUpdateManyWithWhereWithoutCasoInput[]
    deleteMany?: ExameCasoScalarWhereInput | ExameCasoScalarWhereInput[]
  }

  export type CasoClinicoCreateNestedOneWithoutExamesCasoInput = {
    create?: XOR<CasoClinicoCreateWithoutExamesCasoInput, CasoClinicoUncheckedCreateWithoutExamesCasoInput>
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutExamesCasoInput
    connect?: CasoClinicoWhereUniqueInput
  }

  export type CasoClinicoUpdateOneRequiredWithoutExamesCasoNestedInput = {
    create?: XOR<CasoClinicoCreateWithoutExamesCasoInput, CasoClinicoUncheckedCreateWithoutExamesCasoInput>
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutExamesCasoInput
    upsert?: CasoClinicoUpsertWithoutExamesCasoInput
    connect?: CasoClinicoWhereUniqueInput
    update?: XOR<XOR<CasoClinicoUpdateToOneWithWhereWithoutExamesCasoInput, CasoClinicoUpdateWithoutExamesCasoInput>, CasoClinicoUncheckedUpdateWithoutExamesCasoInput>
  }

  export type CasoClinicoCreateNestedOneWithoutInvestigacoesInput = {
    create?: XOR<CasoClinicoCreateWithoutInvestigacoesInput, CasoClinicoUncheckedCreateWithoutInvestigacoesInput>
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutInvestigacoesInput
    connect?: CasoClinicoWhereUniqueInput
  }

  export type UsuarioCreateNestedOneWithoutInvestigacoesInput = {
    create?: XOR<UsuarioCreateWithoutInvestigacoesInput, UsuarioUncheckedCreateWithoutInvestigacoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutInvestigacoesInput
    connect?: UsuarioWhereUniqueInput
  }

  export type RegistroInvestigacaoCreateNestedManyWithoutInvestigacaoInput = {
    create?: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput> | RegistroInvestigacaoCreateWithoutInvestigacaoInput[] | RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput[]
    connectOrCreate?: RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput | RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput[]
    createMany?: RegistroInvestigacaoCreateManyInvestigacaoInputEnvelope
    connect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
  }

  export type RegistroInvestigacaoUncheckedCreateNestedManyWithoutInvestigacaoInput = {
    create?: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput> | RegistroInvestigacaoCreateWithoutInvestigacaoInput[] | RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput[]
    connectOrCreate?: RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput | RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput[]
    createMany?: RegistroInvestigacaoCreateManyInvestigacaoInputEnvelope
    connect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
  }

  export type CasoClinicoUpdateOneRequiredWithoutInvestigacoesNestedInput = {
    create?: XOR<CasoClinicoCreateWithoutInvestigacoesInput, CasoClinicoUncheckedCreateWithoutInvestigacoesInput>
    connectOrCreate?: CasoClinicoCreateOrConnectWithoutInvestigacoesInput
    upsert?: CasoClinicoUpsertWithoutInvestigacoesInput
    connect?: CasoClinicoWhereUniqueInput
    update?: XOR<XOR<CasoClinicoUpdateToOneWithWhereWithoutInvestigacoesInput, CasoClinicoUpdateWithoutInvestigacoesInput>, CasoClinicoUncheckedUpdateWithoutInvestigacoesInput>
  }

  export type UsuarioUpdateOneRequiredWithoutInvestigacoesNestedInput = {
    create?: XOR<UsuarioCreateWithoutInvestigacoesInput, UsuarioUncheckedCreateWithoutInvestigacoesInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutInvestigacoesInput
    upsert?: UsuarioUpsertWithoutInvestigacoesInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutInvestigacoesInput, UsuarioUpdateWithoutInvestigacoesInput>, UsuarioUncheckedUpdateWithoutInvestigacoesInput>
  }

  export type RegistroInvestigacaoUpdateManyWithoutInvestigacaoNestedInput = {
    create?: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput> | RegistroInvestigacaoCreateWithoutInvestigacaoInput[] | RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput[]
    connectOrCreate?: RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput | RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput[]
    upsert?: RegistroInvestigacaoUpsertWithWhereUniqueWithoutInvestigacaoInput | RegistroInvestigacaoUpsertWithWhereUniqueWithoutInvestigacaoInput[]
    createMany?: RegistroInvestigacaoCreateManyInvestigacaoInputEnvelope
    set?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    disconnect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    delete?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    connect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    update?: RegistroInvestigacaoUpdateWithWhereUniqueWithoutInvestigacaoInput | RegistroInvestigacaoUpdateWithWhereUniqueWithoutInvestigacaoInput[]
    updateMany?: RegistroInvestigacaoUpdateManyWithWhereWithoutInvestigacaoInput | RegistroInvestigacaoUpdateManyWithWhereWithoutInvestigacaoInput[]
    deleteMany?: RegistroInvestigacaoScalarWhereInput | RegistroInvestigacaoScalarWhereInput[]
  }

  export type RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoNestedInput = {
    create?: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput> | RegistroInvestigacaoCreateWithoutInvestigacaoInput[] | RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput[]
    connectOrCreate?: RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput | RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput[]
    upsert?: RegistroInvestigacaoUpsertWithWhereUniqueWithoutInvestigacaoInput | RegistroInvestigacaoUpsertWithWhereUniqueWithoutInvestigacaoInput[]
    createMany?: RegistroInvestigacaoCreateManyInvestigacaoInputEnvelope
    set?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    disconnect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    delete?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    connect?: RegistroInvestigacaoWhereUniqueInput | RegistroInvestigacaoWhereUniqueInput[]
    update?: RegistroInvestigacaoUpdateWithWhereUniqueWithoutInvestigacaoInput | RegistroInvestigacaoUpdateWithWhereUniqueWithoutInvestigacaoInput[]
    updateMany?: RegistroInvestigacaoUpdateManyWithWhereWithoutInvestigacaoInput | RegistroInvestigacaoUpdateManyWithWhereWithoutInvestigacaoInput[]
    deleteMany?: RegistroInvestigacaoScalarWhereInput | RegistroInvestigacaoScalarWhereInput[]
  }

  export type InvestigacaoCasoCreateNestedOneWithoutRegistrosInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutRegistrosInput, InvestigacaoCasoUncheckedCreateWithoutRegistrosInput>
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutRegistrosInput
    connect?: InvestigacaoCasoWhereUniqueInput
  }

  export type InvestigacaoCasoUpdateOneRequiredWithoutRegistrosNestedInput = {
    create?: XOR<InvestigacaoCasoCreateWithoutRegistrosInput, InvestigacaoCasoUncheckedCreateWithoutRegistrosInput>
    connectOrCreate?: InvestigacaoCasoCreateOrConnectWithoutRegistrosInput
    upsert?: InvestigacaoCasoUpsertWithoutRegistrosInput
    connect?: InvestigacaoCasoWhereUniqueInput
    update?: XOR<XOR<InvestigacaoCasoUpdateToOneWithWhereWithoutRegistrosInput, InvestigacaoCasoUpdateWithoutRegistrosInput>, InvestigacaoCasoUncheckedUpdateWithoutRegistrosInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumTipoMovimentacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoMovimentacao | EnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoMovimentacaoFilter<$PrismaModel> | $Enums.TipoMovimentacao
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumTipoMovimentacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoMovimentacao | EnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoMovimentacao[] | ListEnumTipoMovimentacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoMovimentacaoWithAggregatesFilter<$PrismaModel> | $Enums.TipoMovimentacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoMovimentacaoFilter<$PrismaModel>
    _max?: NestedEnumTipoMovimentacaoFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DisciplinaCreateWithoutUsuarioInput = {
    nome: string
    createdAt?: Date | string
    questoes?: QuestaoCreateNestedManyWithoutDisciplinaInput
  }

  export type DisciplinaUncheckedCreateWithoutUsuarioInput = {
    id?: number
    nome: string
    createdAt?: Date | string
    questoes?: QuestaoUncheckedCreateNestedManyWithoutDisciplinaInput
  }

  export type DisciplinaCreateOrConnectWithoutUsuarioInput = {
    where: DisciplinaWhereUniqueInput
    create: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput>
  }

  export type DisciplinaCreateManyUsuarioInputEnvelope = {
    data: DisciplinaCreateManyUsuarioInput | DisciplinaCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type QuestaoCreateWithoutUsuarioInput = {
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    disciplina: DisciplinaCreateNestedOneWithoutQuestoesInput
    alternativas?: AlternativaCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUncheckedCreateWithoutUsuarioInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    disciplinaId: number
    alternativas?: AlternativaUncheckedCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoCreateOrConnectWithoutUsuarioInput = {
    where: QuestaoWhereUniqueInput
    create: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput>
  }

  export type QuestaoCreateManyUsuarioInputEnvelope = {
    data: QuestaoCreateManyUsuarioInput | QuestaoCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type RespostaCreateWithoutUsuarioInput = {
    correta: boolean
    respondidaAt?: Date | string
    questao: QuestaoCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateWithoutUsuarioInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    questaoId: number
  }

  export type RespostaCreateOrConnectWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput>
  }

  export type RespostaCreateManyUsuarioInputEnvelope = {
    data: RespostaCreateManyUsuarioInput | RespostaCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type FlashcardCreateWithoutUsuarioInput = {
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardUncheckedCreateWithoutUsuarioInput = {
    id?: number
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FlashcardCreateOrConnectWithoutUsuarioInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput>
  }

  export type FlashcardCreateManyUsuarioInputEnvelope = {
    data: FlashcardCreateManyUsuarioInput | FlashcardCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type MovimentacaoCreateWithoutUsuarioInput = {
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
  }

  export type MovimentacaoUncheckedCreateWithoutUsuarioInput = {
    id?: number
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
  }

  export type MovimentacaoCreateOrConnectWithoutUsuarioInput = {
    where: MovimentacaoWhereUniqueInput
    create: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput>
  }

  export type MovimentacaoCreateManyUsuarioInputEnvelope = {
    data: MovimentacaoCreateManyUsuarioInput | MovimentacaoCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type CasoClinicoCreateWithoutAutorInput = {
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutCasoInput
    examesCaso?: ExameCasoCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoUncheckedCreateWithoutAutorInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutCasoInput
    examesCaso?: ExameCasoUncheckedCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoCreateOrConnectWithoutAutorInput = {
    where: CasoClinicoWhereUniqueInput
    create: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput>
  }

  export type CasoClinicoCreateManyAutorInputEnvelope = {
    data: CasoClinicoCreateManyAutorInput | CasoClinicoCreateManyAutorInput[]
    skipDuplicates?: boolean
  }

  export type InvestigacaoCasoCreateWithoutUsuarioInput = {
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caso: CasoClinicoCreateNestedOneWithoutInvestigacoesInput
    registros?: RegistroInvestigacaoCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoUncheckedCreateWithoutUsuarioInput = {
    id?: number
    casoId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    registros?: RegistroInvestigacaoUncheckedCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoCreateOrConnectWithoutUsuarioInput = {
    where: InvestigacaoCasoWhereUniqueInput
    create: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput>
  }

  export type InvestigacaoCasoCreateManyUsuarioInputEnvelope = {
    data: InvestigacaoCasoCreateManyUsuarioInput | InvestigacaoCasoCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type DisciplinaUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: DisciplinaWhereUniqueInput
    update: XOR<DisciplinaUpdateWithoutUsuarioInput, DisciplinaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<DisciplinaCreateWithoutUsuarioInput, DisciplinaUncheckedCreateWithoutUsuarioInput>
  }

  export type DisciplinaUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: DisciplinaWhereUniqueInput
    data: XOR<DisciplinaUpdateWithoutUsuarioInput, DisciplinaUncheckedUpdateWithoutUsuarioInput>
  }

  export type DisciplinaUpdateManyWithWhereWithoutUsuarioInput = {
    where: DisciplinaScalarWhereInput
    data: XOR<DisciplinaUpdateManyMutationInput, DisciplinaUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type DisciplinaScalarWhereInput = {
    AND?: DisciplinaScalarWhereInput | DisciplinaScalarWhereInput[]
    OR?: DisciplinaScalarWhereInput[]
    NOT?: DisciplinaScalarWhereInput | DisciplinaScalarWhereInput[]
    id?: IntFilter<"Disciplina"> | number
    nome?: StringFilter<"Disciplina"> | string
    createdAt?: DateTimeFilter<"Disciplina"> | Date | string
    usuarioId?: IntFilter<"Disciplina"> | number
  }

  export type QuestaoUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: QuestaoWhereUniqueInput
    update: XOR<QuestaoUpdateWithoutUsuarioInput, QuestaoUncheckedUpdateWithoutUsuarioInput>
    create: XOR<QuestaoCreateWithoutUsuarioInput, QuestaoUncheckedCreateWithoutUsuarioInput>
  }

  export type QuestaoUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: QuestaoWhereUniqueInput
    data: XOR<QuestaoUpdateWithoutUsuarioInput, QuestaoUncheckedUpdateWithoutUsuarioInput>
  }

  export type QuestaoUpdateManyWithWhereWithoutUsuarioInput = {
    where: QuestaoScalarWhereInput
    data: XOR<QuestaoUpdateManyMutationInput, QuestaoUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type QuestaoScalarWhereInput = {
    AND?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
    OR?: QuestaoScalarWhereInput[]
    NOT?: QuestaoScalarWhereInput | QuestaoScalarWhereInput[]
    id?: IntFilter<"Questao"> | number
    enunciado?: StringFilter<"Questao"> | string
    explicacao?: StringNullableFilter<"Questao"> | string | null
    tema?: StringNullableFilter<"Questao"> | string | null
    dificuldade?: StringNullableFilter<"Questao"> | string | null
    createdAt?: DateTimeFilter<"Questao"> | Date | string
    usuarioId?: IntFilter<"Questao"> | number
    disciplinaId?: IntFilter<"Questao"> | number
  }

  export type RespostaUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutUsuarioInput, RespostaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<RespostaCreateWithoutUsuarioInput, RespostaUncheckedCreateWithoutUsuarioInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutUsuarioInput, RespostaUncheckedUpdateWithoutUsuarioInput>
  }

  export type RespostaUpdateManyWithWhereWithoutUsuarioInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type RespostaScalarWhereInput = {
    AND?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    OR?: RespostaScalarWhereInput[]
    NOT?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    id?: IntFilter<"Resposta"> | number
    correta?: BoolFilter<"Resposta"> | boolean
    respondidaAt?: DateTimeFilter<"Resposta"> | Date | string
    usuarioId?: IntFilter<"Resposta"> | number
    questaoId?: IntFilter<"Resposta"> | number
  }

  export type FlashcardUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: FlashcardWhereUniqueInput
    update: XOR<FlashcardUpdateWithoutUsuarioInput, FlashcardUncheckedUpdateWithoutUsuarioInput>
    create: XOR<FlashcardCreateWithoutUsuarioInput, FlashcardUncheckedCreateWithoutUsuarioInput>
  }

  export type FlashcardUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: FlashcardWhereUniqueInput
    data: XOR<FlashcardUpdateWithoutUsuarioInput, FlashcardUncheckedUpdateWithoutUsuarioInput>
  }

  export type FlashcardUpdateManyWithWhereWithoutUsuarioInput = {
    where: FlashcardScalarWhereInput
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type FlashcardScalarWhereInput = {
    AND?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    OR?: FlashcardScalarWhereInput[]
    NOT?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    id?: IntFilter<"Flashcard"> | number
    frente?: StringFilter<"Flashcard"> | string
    verso?: StringFilter<"Flashcard"> | string
    createdAt?: DateTimeFilter<"Flashcard"> | Date | string
    updatedAt?: DateTimeFilter<"Flashcard"> | Date | string
    usuarioId?: IntFilter<"Flashcard"> | number
  }

  export type MovimentacaoUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: MovimentacaoWhereUniqueInput
    update: XOR<MovimentacaoUpdateWithoutUsuarioInput, MovimentacaoUncheckedUpdateWithoutUsuarioInput>
    create: XOR<MovimentacaoCreateWithoutUsuarioInput, MovimentacaoUncheckedCreateWithoutUsuarioInput>
  }

  export type MovimentacaoUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: MovimentacaoWhereUniqueInput
    data: XOR<MovimentacaoUpdateWithoutUsuarioInput, MovimentacaoUncheckedUpdateWithoutUsuarioInput>
  }

  export type MovimentacaoUpdateManyWithWhereWithoutUsuarioInput = {
    where: MovimentacaoScalarWhereInput
    data: XOR<MovimentacaoUpdateManyMutationInput, MovimentacaoUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type MovimentacaoScalarWhereInput = {
    AND?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
    OR?: MovimentacaoScalarWhereInput[]
    NOT?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
    id?: IntFilter<"Movimentacao"> | number
    descricao?: StringFilter<"Movimentacao"> | string
    valor?: DecimalFilter<"Movimentacao"> | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFilter<"Movimentacao"> | $Enums.TipoMovimentacao
    data?: DateTimeFilter<"Movimentacao"> | Date | string
    createdAt?: DateTimeFilter<"Movimentacao"> | Date | string
    usuarioId?: IntFilter<"Movimentacao"> | number
  }

  export type CasoClinicoUpsertWithWhereUniqueWithoutAutorInput = {
    where: CasoClinicoWhereUniqueInput
    update: XOR<CasoClinicoUpdateWithoutAutorInput, CasoClinicoUncheckedUpdateWithoutAutorInput>
    create: XOR<CasoClinicoCreateWithoutAutorInput, CasoClinicoUncheckedCreateWithoutAutorInput>
  }

  export type CasoClinicoUpdateWithWhereUniqueWithoutAutorInput = {
    where: CasoClinicoWhereUniqueInput
    data: XOR<CasoClinicoUpdateWithoutAutorInput, CasoClinicoUncheckedUpdateWithoutAutorInput>
  }

  export type CasoClinicoUpdateManyWithWhereWithoutAutorInput = {
    where: CasoClinicoScalarWhereInput
    data: XOR<CasoClinicoUpdateManyMutationInput, CasoClinicoUncheckedUpdateManyWithoutAutorInput>
  }

  export type CasoClinicoScalarWhereInput = {
    AND?: CasoClinicoScalarWhereInput | CasoClinicoScalarWhereInput[]
    OR?: CasoClinicoScalarWhereInput[]
    NOT?: CasoClinicoScalarWhereInput | CasoClinicoScalarWhereInput[]
    id?: IntFilter<"CasoClinico"> | number
    titulo?: StringFilter<"CasoClinico"> | string
    area?: StringFilter<"CasoClinico"> | string
    especialidade?: StringNullableFilter<"CasoClinico"> | string | null
    dificuldade?: StringFilter<"CasoClinico"> | string
    cenario?: StringFilter<"CasoClinico"> | string
    queixaInicial?: StringFilter<"CasoClinico"> | string
    dadosIniciais?: JsonFilter<"CasoClinico">
    anamnese?: JsonFilter<"CasoClinico">
    exameFisico?: JsonFilter<"CasoClinico">
    sinaisVitais?: JsonFilter<"CasoClinico">
    exames?: JsonFilter<"CasoClinico">
    evolucao?: JsonFilter<"CasoClinico">
    diagnosticoFinal?: StringFilter<"CasoClinico"> | string
    explicacaoDiagnostico?: StringFilter<"CasoClinico"> | string
    diagnosticosDiferenciais?: JsonFilter<"CasoClinico">
    pontosChave?: JsonFilter<"CasoClinico">
    publicado?: BoolFilter<"CasoClinico"> | boolean
    geradoPorIA?: BoolFilter<"CasoClinico"> | boolean
    createdAt?: DateTimeFilter<"CasoClinico"> | Date | string
    updatedAt?: DateTimeFilter<"CasoClinico"> | Date | string
    autorId?: IntFilter<"CasoClinico"> | number
  }

  export type InvestigacaoCasoUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: InvestigacaoCasoWhereUniqueInput
    update: XOR<InvestigacaoCasoUpdateWithoutUsuarioInput, InvestigacaoCasoUncheckedUpdateWithoutUsuarioInput>
    create: XOR<InvestigacaoCasoCreateWithoutUsuarioInput, InvestigacaoCasoUncheckedCreateWithoutUsuarioInput>
  }

  export type InvestigacaoCasoUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: InvestigacaoCasoWhereUniqueInput
    data: XOR<InvestigacaoCasoUpdateWithoutUsuarioInput, InvestigacaoCasoUncheckedUpdateWithoutUsuarioInput>
  }

  export type InvestigacaoCasoUpdateManyWithWhereWithoutUsuarioInput = {
    where: InvestigacaoCasoScalarWhereInput
    data: XOR<InvestigacaoCasoUpdateManyMutationInput, InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type InvestigacaoCasoScalarWhereInput = {
    AND?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
    OR?: InvestigacaoCasoScalarWhereInput[]
    NOT?: InvestigacaoCasoScalarWhereInput | InvestigacaoCasoScalarWhereInput[]
    id?: IntFilter<"InvestigacaoCaso"> | number
    casoId?: IntFilter<"InvestigacaoCaso"> | number
    usuarioId?: IntFilter<"InvestigacaoCaso"> | number
    status?: StringFilter<"InvestigacaoCaso"> | string
    informacoesColetadas?: JsonFilter<"InvestigacaoCaso">
    hipotese?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    justificativa?: StringNullableFilter<"InvestigacaoCaso"> | string | null
    avaliacao?: JsonNullableFilter<"InvestigacaoCaso">
    finalizado?: BoolFilter<"InvestigacaoCaso"> | boolean
    createdAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
    updatedAt?: DateTimeFilter<"InvestigacaoCaso"> | Date | string
  }

  export type UsuarioCreateWithoutDisciplinasInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutDisciplinasInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutDisciplinasInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutDisciplinasInput, UsuarioUncheckedCreateWithoutDisciplinasInput>
  }

  export type QuestaoCreateWithoutDisciplinaInput = {
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutQuestoesInput
    alternativas?: AlternativaCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUncheckedCreateWithoutDisciplinaInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
    alternativas?: AlternativaUncheckedCreateNestedManyWithoutQuestaoInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoCreateOrConnectWithoutDisciplinaInput = {
    where: QuestaoWhereUniqueInput
    create: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput>
  }

  export type QuestaoCreateManyDisciplinaInputEnvelope = {
    data: QuestaoCreateManyDisciplinaInput | QuestaoCreateManyDisciplinaInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutDisciplinasInput = {
    update: XOR<UsuarioUpdateWithoutDisciplinasInput, UsuarioUncheckedUpdateWithoutDisciplinasInput>
    create: XOR<UsuarioCreateWithoutDisciplinasInput, UsuarioUncheckedCreateWithoutDisciplinasInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutDisciplinasInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutDisciplinasInput, UsuarioUncheckedUpdateWithoutDisciplinasInput>
  }

  export type UsuarioUpdateWithoutDisciplinasInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutDisciplinasInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type QuestaoUpsertWithWhereUniqueWithoutDisciplinaInput = {
    where: QuestaoWhereUniqueInput
    update: XOR<QuestaoUpdateWithoutDisciplinaInput, QuestaoUncheckedUpdateWithoutDisciplinaInput>
    create: XOR<QuestaoCreateWithoutDisciplinaInput, QuestaoUncheckedCreateWithoutDisciplinaInput>
  }

  export type QuestaoUpdateWithWhereUniqueWithoutDisciplinaInput = {
    where: QuestaoWhereUniqueInput
    data: XOR<QuestaoUpdateWithoutDisciplinaInput, QuestaoUncheckedUpdateWithoutDisciplinaInput>
  }

  export type QuestaoUpdateManyWithWhereWithoutDisciplinaInput = {
    where: QuestaoScalarWhereInput
    data: XOR<QuestaoUpdateManyMutationInput, QuestaoUncheckedUpdateManyWithoutDisciplinaInput>
  }

  export type UsuarioCreateWithoutQuestoesInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutQuestoesInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutQuestoesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutQuestoesInput, UsuarioUncheckedCreateWithoutQuestoesInput>
  }

  export type DisciplinaCreateWithoutQuestoesInput = {
    nome: string
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutDisciplinasInput
  }

  export type DisciplinaUncheckedCreateWithoutQuestoesInput = {
    id?: number
    nome: string
    createdAt?: Date | string
    usuarioId: number
  }

  export type DisciplinaCreateOrConnectWithoutQuestoesInput = {
    where: DisciplinaWhereUniqueInput
    create: XOR<DisciplinaCreateWithoutQuestoesInput, DisciplinaUncheckedCreateWithoutQuestoesInput>
  }

  export type AlternativaCreateWithoutQuestaoInput = {
    texto: string
    correta?: boolean
  }

  export type AlternativaUncheckedCreateWithoutQuestaoInput = {
    id?: number
    texto: string
    correta?: boolean
  }

  export type AlternativaCreateOrConnectWithoutQuestaoInput = {
    where: AlternativaWhereUniqueInput
    create: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput>
  }

  export type AlternativaCreateManyQuestaoInputEnvelope = {
    data: AlternativaCreateManyQuestaoInput | AlternativaCreateManyQuestaoInput[]
    skipDuplicates?: boolean
  }

  export type RespostaCreateWithoutQuestaoInput = {
    correta: boolean
    respondidaAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateWithoutQuestaoInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    usuarioId: number
  }

  export type RespostaCreateOrConnectWithoutQuestaoInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput>
  }

  export type RespostaCreateManyQuestaoInputEnvelope = {
    data: RespostaCreateManyQuestaoInput | RespostaCreateManyQuestaoInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutQuestoesInput = {
    update: XOR<UsuarioUpdateWithoutQuestoesInput, UsuarioUncheckedUpdateWithoutQuestoesInput>
    create: XOR<UsuarioCreateWithoutQuestoesInput, UsuarioUncheckedCreateWithoutQuestoesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutQuestoesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutQuestoesInput, UsuarioUncheckedUpdateWithoutQuestoesInput>
  }

  export type UsuarioUpdateWithoutQuestoesInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutQuestoesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type DisciplinaUpsertWithoutQuestoesInput = {
    update: XOR<DisciplinaUpdateWithoutQuestoesInput, DisciplinaUncheckedUpdateWithoutQuestoesInput>
    create: XOR<DisciplinaCreateWithoutQuestoesInput, DisciplinaUncheckedCreateWithoutQuestoesInput>
    where?: DisciplinaWhereInput
  }

  export type DisciplinaUpdateToOneWithWhereWithoutQuestoesInput = {
    where?: DisciplinaWhereInput
    data: XOR<DisciplinaUpdateWithoutQuestoesInput, DisciplinaUncheckedUpdateWithoutQuestoesInput>
  }

  export type DisciplinaUpdateWithoutQuestoesInput = {
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutDisciplinasNestedInput
  }

  export type DisciplinaUncheckedUpdateWithoutQuestoesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type AlternativaUpsertWithWhereUniqueWithoutQuestaoInput = {
    where: AlternativaWhereUniqueInput
    update: XOR<AlternativaUpdateWithoutQuestaoInput, AlternativaUncheckedUpdateWithoutQuestaoInput>
    create: XOR<AlternativaCreateWithoutQuestaoInput, AlternativaUncheckedCreateWithoutQuestaoInput>
  }

  export type AlternativaUpdateWithWhereUniqueWithoutQuestaoInput = {
    where: AlternativaWhereUniqueInput
    data: XOR<AlternativaUpdateWithoutQuestaoInput, AlternativaUncheckedUpdateWithoutQuestaoInput>
  }

  export type AlternativaUpdateManyWithWhereWithoutQuestaoInput = {
    where: AlternativaScalarWhereInput
    data: XOR<AlternativaUpdateManyMutationInput, AlternativaUncheckedUpdateManyWithoutQuestaoInput>
  }

  export type AlternativaScalarWhereInput = {
    AND?: AlternativaScalarWhereInput | AlternativaScalarWhereInput[]
    OR?: AlternativaScalarWhereInput[]
    NOT?: AlternativaScalarWhereInput | AlternativaScalarWhereInput[]
    id?: IntFilter<"Alternativa"> | number
    texto?: StringFilter<"Alternativa"> | string
    correta?: BoolFilter<"Alternativa"> | boolean
    questaoId?: IntFilter<"Alternativa"> | number
  }

  export type RespostaUpsertWithWhereUniqueWithoutQuestaoInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutQuestaoInput, RespostaUncheckedUpdateWithoutQuestaoInput>
    create: XOR<RespostaCreateWithoutQuestaoInput, RespostaUncheckedCreateWithoutQuestaoInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutQuestaoInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutQuestaoInput, RespostaUncheckedUpdateWithoutQuestaoInput>
  }

  export type RespostaUpdateManyWithWhereWithoutQuestaoInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutQuestaoInput>
  }

  export type QuestaoCreateWithoutAlternativasInput = {
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutQuestoesInput
    disciplina: DisciplinaCreateNestedOneWithoutQuestoesInput
    respostas?: RespostaCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUncheckedCreateWithoutAlternativasInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
    disciplinaId: number
    respostas?: RespostaUncheckedCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoCreateOrConnectWithoutAlternativasInput = {
    where: QuestaoWhereUniqueInput
    create: XOR<QuestaoCreateWithoutAlternativasInput, QuestaoUncheckedCreateWithoutAlternativasInput>
  }

  export type QuestaoUpsertWithoutAlternativasInput = {
    update: XOR<QuestaoUpdateWithoutAlternativasInput, QuestaoUncheckedUpdateWithoutAlternativasInput>
    create: XOR<QuestaoCreateWithoutAlternativasInput, QuestaoUncheckedCreateWithoutAlternativasInput>
    where?: QuestaoWhereInput
  }

  export type QuestaoUpdateToOneWithWhereWithoutAlternativasInput = {
    where?: QuestaoWhereInput
    data: XOR<QuestaoUpdateWithoutAlternativasInput, QuestaoUncheckedUpdateWithoutAlternativasInput>
  }

  export type QuestaoUpdateWithoutAlternativasInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutQuestoesNestedInput
    disciplina?: DisciplinaUpdateOneRequiredWithoutQuestoesNestedInput
    respostas?: RespostaUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateWithoutAlternativasInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    disciplinaId?: IntFieldUpdateOperationsInput | number
    respostas?: RespostaUncheckedUpdateManyWithoutQuestaoNestedInput
  }

  export type UsuarioCreateWithoutRespostasInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutRespostasInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutRespostasInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutRespostasInput, UsuarioUncheckedCreateWithoutRespostasInput>
  }

  export type QuestaoCreateWithoutRespostasInput = {
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutQuestoesInput
    disciplina: DisciplinaCreateNestedOneWithoutQuestoesInput
    alternativas?: AlternativaCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoUncheckedCreateWithoutRespostasInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
    disciplinaId: number
    alternativas?: AlternativaUncheckedCreateNestedManyWithoutQuestaoInput
  }

  export type QuestaoCreateOrConnectWithoutRespostasInput = {
    where: QuestaoWhereUniqueInput
    create: XOR<QuestaoCreateWithoutRespostasInput, QuestaoUncheckedCreateWithoutRespostasInput>
  }

  export type UsuarioUpsertWithoutRespostasInput = {
    update: XOR<UsuarioUpdateWithoutRespostasInput, UsuarioUncheckedUpdateWithoutRespostasInput>
    create: XOR<UsuarioCreateWithoutRespostasInput, UsuarioUncheckedCreateWithoutRespostasInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutRespostasInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutRespostasInput, UsuarioUncheckedUpdateWithoutRespostasInput>
  }

  export type UsuarioUpdateWithoutRespostasInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutRespostasInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type QuestaoUpsertWithoutRespostasInput = {
    update: XOR<QuestaoUpdateWithoutRespostasInput, QuestaoUncheckedUpdateWithoutRespostasInput>
    create: XOR<QuestaoCreateWithoutRespostasInput, QuestaoUncheckedCreateWithoutRespostasInput>
    where?: QuestaoWhereInput
  }

  export type QuestaoUpdateToOneWithWhereWithoutRespostasInput = {
    where?: QuestaoWhereInput
    data: XOR<QuestaoUpdateWithoutRespostasInput, QuestaoUncheckedUpdateWithoutRespostasInput>
  }

  export type QuestaoUpdateWithoutRespostasInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutQuestoesNestedInput
    disciplina?: DisciplinaUpdateOneRequiredWithoutQuestoesNestedInput
    alternativas?: AlternativaUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateWithoutRespostasInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    disciplinaId?: IntFieldUpdateOperationsInput | number
    alternativas?: AlternativaUncheckedUpdateManyWithoutQuestaoNestedInput
  }

  export type UsuarioCreateWithoutFlashcardsInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutFlashcardsInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutFlashcardsInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutFlashcardsInput, UsuarioUncheckedCreateWithoutFlashcardsInput>
  }

  export type UsuarioUpsertWithoutFlashcardsInput = {
    update: XOR<UsuarioUpdateWithoutFlashcardsInput, UsuarioUncheckedUpdateWithoutFlashcardsInput>
    create: XOR<UsuarioCreateWithoutFlashcardsInput, UsuarioUncheckedCreateWithoutFlashcardsInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutFlashcardsInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutFlashcardsInput, UsuarioUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UsuarioUpdateWithoutFlashcardsInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutFlashcardsInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateWithoutMovimentacoesInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutMovimentacoesInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutMovimentacoesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutMovimentacoesInput, UsuarioUncheckedCreateWithoutMovimentacoesInput>
  }

  export type UsuarioUpsertWithoutMovimentacoesInput = {
    update: XOR<UsuarioUpdateWithoutMovimentacoesInput, UsuarioUncheckedUpdateWithoutMovimentacoesInput>
    create: XOR<UsuarioCreateWithoutMovimentacoesInput, UsuarioUncheckedCreateWithoutMovimentacoesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutMovimentacoesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutMovimentacoesInput, UsuarioUncheckedUpdateWithoutMovimentacoesInput>
  }

  export type UsuarioUpdateWithoutMovimentacoesInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutMovimentacoesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateWithoutCasosCriadosInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateWithoutCasosCriadosInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioCreateOrConnectWithoutCasosCriadosInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutCasosCriadosInput, UsuarioUncheckedCreateWithoutCasosCriadosInput>
  }

  export type InvestigacaoCasoCreateWithoutCasoInput = {
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    usuario: UsuarioCreateNestedOneWithoutInvestigacoesInput
    registros?: RegistroInvestigacaoCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoUncheckedCreateWithoutCasoInput = {
    id?: number
    usuarioId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    registros?: RegistroInvestigacaoUncheckedCreateNestedManyWithoutInvestigacaoInput
  }

  export type InvestigacaoCasoCreateOrConnectWithoutCasoInput = {
    where: InvestigacaoCasoWhereUniqueInput
    create: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput>
  }

  export type InvestigacaoCasoCreateManyCasoInputEnvelope = {
    data: InvestigacaoCasoCreateManyCasoInput | InvestigacaoCasoCreateManyCasoInput[]
    skipDuplicates?: boolean
  }

  export type ExameCasoCreateWithoutCasoInput = {
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
  }

  export type ExameCasoUncheckedCreateWithoutCasoInput = {
    id?: number
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
  }

  export type ExameCasoCreateOrConnectWithoutCasoInput = {
    where: ExameCasoWhereUniqueInput
    create: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput>
  }

  export type ExameCasoCreateManyCasoInputEnvelope = {
    data: ExameCasoCreateManyCasoInput | ExameCasoCreateManyCasoInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutCasosCriadosInput = {
    update: XOR<UsuarioUpdateWithoutCasosCriadosInput, UsuarioUncheckedUpdateWithoutCasosCriadosInput>
    create: XOR<UsuarioCreateWithoutCasosCriadosInput, UsuarioUncheckedCreateWithoutCasosCriadosInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutCasosCriadosInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutCasosCriadosInput, UsuarioUncheckedUpdateWithoutCasosCriadosInput>
  }

  export type UsuarioUpdateWithoutCasosCriadosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutCasosCriadosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type InvestigacaoCasoUpsertWithWhereUniqueWithoutCasoInput = {
    where: InvestigacaoCasoWhereUniqueInput
    update: XOR<InvestigacaoCasoUpdateWithoutCasoInput, InvestigacaoCasoUncheckedUpdateWithoutCasoInput>
    create: XOR<InvestigacaoCasoCreateWithoutCasoInput, InvestigacaoCasoUncheckedCreateWithoutCasoInput>
  }

  export type InvestigacaoCasoUpdateWithWhereUniqueWithoutCasoInput = {
    where: InvestigacaoCasoWhereUniqueInput
    data: XOR<InvestigacaoCasoUpdateWithoutCasoInput, InvestigacaoCasoUncheckedUpdateWithoutCasoInput>
  }

  export type InvestigacaoCasoUpdateManyWithWhereWithoutCasoInput = {
    where: InvestigacaoCasoScalarWhereInput
    data: XOR<InvestigacaoCasoUpdateManyMutationInput, InvestigacaoCasoUncheckedUpdateManyWithoutCasoInput>
  }

  export type ExameCasoUpsertWithWhereUniqueWithoutCasoInput = {
    where: ExameCasoWhereUniqueInput
    update: XOR<ExameCasoUpdateWithoutCasoInput, ExameCasoUncheckedUpdateWithoutCasoInput>
    create: XOR<ExameCasoCreateWithoutCasoInput, ExameCasoUncheckedCreateWithoutCasoInput>
  }

  export type ExameCasoUpdateWithWhereUniqueWithoutCasoInput = {
    where: ExameCasoWhereUniqueInput
    data: XOR<ExameCasoUpdateWithoutCasoInput, ExameCasoUncheckedUpdateWithoutCasoInput>
  }

  export type ExameCasoUpdateManyWithWhereWithoutCasoInput = {
    where: ExameCasoScalarWhereInput
    data: XOR<ExameCasoUpdateManyMutationInput, ExameCasoUncheckedUpdateManyWithoutCasoInput>
  }

  export type ExameCasoScalarWhereInput = {
    AND?: ExameCasoScalarWhereInput | ExameCasoScalarWhereInput[]
    OR?: ExameCasoScalarWhereInput[]
    NOT?: ExameCasoScalarWhereInput | ExameCasoScalarWhereInput[]
    id?: IntFilter<"ExameCaso"> | number
    casoId?: IntFilter<"ExameCaso"> | number
    nome?: StringFilter<"ExameCaso"> | string
    categoria?: StringNullableFilter<"ExameCaso"> | string | null
    resultado?: StringFilter<"ExameCaso"> | string
    interpretacao?: StringNullableFilter<"ExameCaso"> | string | null
    disponivel?: BoolFilter<"ExameCaso"> | boolean
    ordem?: IntFilter<"ExameCaso"> | number
    createdAt?: DateTimeFilter<"ExameCaso"> | Date | string
  }

  export type CasoClinicoCreateWithoutExamesCasoInput = {
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autor: UsuarioCreateNestedOneWithoutCasosCriadosInput
    investigacoes?: InvestigacaoCasoCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoUncheckedCreateWithoutExamesCasoInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autorId: number
    investigacoes?: InvestigacaoCasoUncheckedCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoCreateOrConnectWithoutExamesCasoInput = {
    where: CasoClinicoWhereUniqueInput
    create: XOR<CasoClinicoCreateWithoutExamesCasoInput, CasoClinicoUncheckedCreateWithoutExamesCasoInput>
  }

  export type CasoClinicoUpsertWithoutExamesCasoInput = {
    update: XOR<CasoClinicoUpdateWithoutExamesCasoInput, CasoClinicoUncheckedUpdateWithoutExamesCasoInput>
    create: XOR<CasoClinicoCreateWithoutExamesCasoInput, CasoClinicoUncheckedCreateWithoutExamesCasoInput>
    where?: CasoClinicoWhereInput
  }

  export type CasoClinicoUpdateToOneWithWhereWithoutExamesCasoInput = {
    where?: CasoClinicoWhereInput
    data: XOR<CasoClinicoUpdateWithoutExamesCasoInput, CasoClinicoUncheckedUpdateWithoutExamesCasoInput>
  }

  export type CasoClinicoUpdateWithoutExamesCasoInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autor?: UsuarioUpdateOneRequiredWithoutCasosCriadosNestedInput
    investigacoes?: InvestigacaoCasoUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoUncheckedUpdateWithoutExamesCasoInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autorId?: IntFieldUpdateOperationsInput | number
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoCreateWithoutInvestigacoesInput = {
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autor: UsuarioCreateNestedOneWithoutCasosCriadosInput
    examesCaso?: ExameCasoCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoUncheckedCreateWithoutInvestigacoesInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    autorId: number
    examesCaso?: ExameCasoUncheckedCreateNestedManyWithoutCasoInput
  }

  export type CasoClinicoCreateOrConnectWithoutInvestigacoesInput = {
    where: CasoClinicoWhereUniqueInput
    create: XOR<CasoClinicoCreateWithoutInvestigacoesInput, CasoClinicoUncheckedCreateWithoutInvestigacoesInput>
  }

  export type UsuarioCreateWithoutInvestigacoesInput = {
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoCreateNestedManyWithoutAutorInput
  }

  export type UsuarioUncheckedCreateWithoutInvestigacoesInput = {
    id?: number
    nome: string
    email: string
    senhaHash?: string | null
    createdAt?: Date | string
    disciplinas?: DisciplinaUncheckedCreateNestedManyWithoutUsuarioInput
    questoes?: QuestaoUncheckedCreateNestedManyWithoutUsuarioInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutUsuarioInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutUsuarioInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutUsuarioInput
    casosCriados?: CasoClinicoUncheckedCreateNestedManyWithoutAutorInput
  }

  export type UsuarioCreateOrConnectWithoutInvestigacoesInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutInvestigacoesInput, UsuarioUncheckedCreateWithoutInvestigacoesInput>
  }

  export type RegistroInvestigacaoCreateWithoutInvestigacaoInput = {
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
  }

  export type RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput = {
    id?: number
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
  }

  export type RegistroInvestigacaoCreateOrConnectWithoutInvestigacaoInput = {
    where: RegistroInvestigacaoWhereUniqueInput
    create: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput>
  }

  export type RegistroInvestigacaoCreateManyInvestigacaoInputEnvelope = {
    data: RegistroInvestigacaoCreateManyInvestigacaoInput | RegistroInvestigacaoCreateManyInvestigacaoInput[]
    skipDuplicates?: boolean
  }

  export type CasoClinicoUpsertWithoutInvestigacoesInput = {
    update: XOR<CasoClinicoUpdateWithoutInvestigacoesInput, CasoClinicoUncheckedUpdateWithoutInvestigacoesInput>
    create: XOR<CasoClinicoCreateWithoutInvestigacoesInput, CasoClinicoUncheckedCreateWithoutInvestigacoesInput>
    where?: CasoClinicoWhereInput
  }

  export type CasoClinicoUpdateToOneWithWhereWithoutInvestigacoesInput = {
    where?: CasoClinicoWhereInput
    data: XOR<CasoClinicoUpdateWithoutInvestigacoesInput, CasoClinicoUncheckedUpdateWithoutInvestigacoesInput>
  }

  export type CasoClinicoUpdateWithoutInvestigacoesInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autor?: UsuarioUpdateOneRequiredWithoutCasosCriadosNestedInput
    examesCaso?: ExameCasoUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoUncheckedUpdateWithoutInvestigacoesInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autorId?: IntFieldUpdateOperationsInput | number
    examesCaso?: ExameCasoUncheckedUpdateManyWithoutCasoNestedInput
  }

  export type UsuarioUpsertWithoutInvestigacoesInput = {
    update: XOR<UsuarioUpdateWithoutInvestigacoesInput, UsuarioUncheckedUpdateWithoutInvestigacoesInput>
    create: XOR<UsuarioCreateWithoutInvestigacoesInput, UsuarioUncheckedCreateWithoutInvestigacoesInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutInvestigacoesInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutInvestigacoesInput, UsuarioUncheckedUpdateWithoutInvestigacoesInput>
  }

  export type UsuarioUpdateWithoutInvestigacoesInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUpdateManyWithoutAutorNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutInvestigacoesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinas?: DisciplinaUncheckedUpdateManyWithoutUsuarioNestedInput
    questoes?: QuestaoUncheckedUpdateManyWithoutUsuarioNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutUsuarioNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutUsuarioNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutUsuarioNestedInput
    casosCriados?: CasoClinicoUncheckedUpdateManyWithoutAutorNestedInput
  }

  export type RegistroInvestigacaoUpsertWithWhereUniqueWithoutInvestigacaoInput = {
    where: RegistroInvestigacaoWhereUniqueInput
    update: XOR<RegistroInvestigacaoUpdateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedUpdateWithoutInvestigacaoInput>
    create: XOR<RegistroInvestigacaoCreateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedCreateWithoutInvestigacaoInput>
  }

  export type RegistroInvestigacaoUpdateWithWhereUniqueWithoutInvestigacaoInput = {
    where: RegistroInvestigacaoWhereUniqueInput
    data: XOR<RegistroInvestigacaoUpdateWithoutInvestigacaoInput, RegistroInvestigacaoUncheckedUpdateWithoutInvestigacaoInput>
  }

  export type RegistroInvestigacaoUpdateManyWithWhereWithoutInvestigacaoInput = {
    where: RegistroInvestigacaoScalarWhereInput
    data: XOR<RegistroInvestigacaoUpdateManyMutationInput, RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoInput>
  }

  export type RegistroInvestigacaoScalarWhereInput = {
    AND?: RegistroInvestigacaoScalarWhereInput | RegistroInvestigacaoScalarWhereInput[]
    OR?: RegistroInvestigacaoScalarWhereInput[]
    NOT?: RegistroInvestigacaoScalarWhereInput | RegistroInvestigacaoScalarWhereInput[]
    id?: IntFilter<"RegistroInvestigacao"> | number
    investigacaoId?: IntFilter<"RegistroInvestigacao"> | number
    tipo?: StringFilter<"RegistroInvestigacao"> | string
    titulo?: StringFilter<"RegistroInvestigacao"> | string
    pergunta?: StringNullableFilter<"RegistroInvestigacao"> | string | null
    resposta?: StringFilter<"RegistroInvestigacao"> | string
    ordem?: IntFilter<"RegistroInvestigacao"> | number
    createdAt?: DateTimeFilter<"RegistroInvestigacao"> | Date | string
  }

  export type InvestigacaoCasoCreateWithoutRegistrosInput = {
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    caso: CasoClinicoCreateNestedOneWithoutInvestigacoesInput
    usuario: UsuarioCreateNestedOneWithoutInvestigacoesInput
  }

  export type InvestigacaoCasoUncheckedCreateWithoutRegistrosInput = {
    id?: number
    casoId: number
    usuarioId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigacaoCasoCreateOrConnectWithoutRegistrosInput = {
    where: InvestigacaoCasoWhereUniqueInput
    create: XOR<InvestigacaoCasoCreateWithoutRegistrosInput, InvestigacaoCasoUncheckedCreateWithoutRegistrosInput>
  }

  export type InvestigacaoCasoUpsertWithoutRegistrosInput = {
    update: XOR<InvestigacaoCasoUpdateWithoutRegistrosInput, InvestigacaoCasoUncheckedUpdateWithoutRegistrosInput>
    create: XOR<InvestigacaoCasoCreateWithoutRegistrosInput, InvestigacaoCasoUncheckedCreateWithoutRegistrosInput>
    where?: InvestigacaoCasoWhereInput
  }

  export type InvestigacaoCasoUpdateToOneWithWhereWithoutRegistrosInput = {
    where?: InvestigacaoCasoWhereInput
    data: XOR<InvestigacaoCasoUpdateWithoutRegistrosInput, InvestigacaoCasoUncheckedUpdateWithoutRegistrosInput>
  }

  export type InvestigacaoCasoUpdateWithoutRegistrosInput = {
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caso?: CasoClinicoUpdateOneRequiredWithoutInvestigacoesNestedInput
    usuario?: UsuarioUpdateOneRequiredWithoutInvestigacoesNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateWithoutRegistrosInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisciplinaCreateManyUsuarioInput = {
    id?: number
    nome: string
    createdAt?: Date | string
  }

  export type QuestaoCreateManyUsuarioInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    disciplinaId: number
  }

  export type RespostaCreateManyUsuarioInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    questaoId: number
  }

  export type FlashcardCreateManyUsuarioInput = {
    id?: number
    frente: string
    verso: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MovimentacaoCreateManyUsuarioInput = {
    id?: number
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    tipo: $Enums.TipoMovimentacao
    data?: Date | string
    createdAt?: Date | string
  }

  export type CasoClinicoCreateManyAutorInput = {
    id?: number
    titulo: string
    area: string
    especialidade?: string | null
    dificuldade: string
    cenario: string
    queixaInicial: string
    dadosIniciais: JsonNullValueInput | InputJsonValue
    anamnese: JsonNullValueInput | InputJsonValue
    exameFisico: JsonNullValueInput | InputJsonValue
    sinaisVitais: JsonNullValueInput | InputJsonValue
    exames: JsonNullValueInput | InputJsonValue
    evolucao: JsonNullValueInput | InputJsonValue
    diagnosticoFinal: string
    explicacaoDiagnostico: string
    diagnosticosDiferenciais: JsonNullValueInput | InputJsonValue
    pontosChave: JsonNullValueInput | InputJsonValue
    publicado?: boolean
    geradoPorIA?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvestigacaoCasoCreateManyUsuarioInput = {
    id?: number
    casoId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DisciplinaUpdateWithoutUsuarioInput = {
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questoes?: QuestaoUpdateManyWithoutDisciplinaNestedInput
  }

  export type DisciplinaUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questoes?: QuestaoUncheckedUpdateManyWithoutDisciplinaNestedInput
  }

  export type DisciplinaUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestaoUpdateWithoutUsuarioInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplina?: DisciplinaUpdateOneRequiredWithoutQuestoesNestedInput
    alternativas?: AlternativaUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinaId?: IntFieldUpdateOperationsInput | number
    alternativas?: AlternativaUncheckedUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disciplinaId?: IntFieldUpdateOperationsInput | number
  }

  export type RespostaUpdateWithoutUsuarioInput = {
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questao?: QuestaoUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type RespostaUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    questaoId?: IntFieldUpdateOperationsInput | number
  }

  export type FlashcardUpdateWithoutUsuarioInput = {
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlashcardUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    frente?: StringFieldUpdateOperationsInput | string
    verso?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUpdateWithoutUsuarioInput = {
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tipo?: EnumTipoMovimentacaoFieldUpdateOperationsInput | $Enums.TipoMovimentacao
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CasoClinicoUpdateWithoutAutorInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    investigacoes?: InvestigacaoCasoUpdateManyWithoutCasoNestedInput
    examesCaso?: ExameCasoUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoUncheckedUpdateWithoutAutorInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    investigacoes?: InvestigacaoCasoUncheckedUpdateManyWithoutCasoNestedInput
    examesCaso?: ExameCasoUncheckedUpdateManyWithoutCasoNestedInput
  }

  export type CasoClinicoUncheckedUpdateManyWithoutAutorInput = {
    id?: IntFieldUpdateOperationsInput | number
    titulo?: StringFieldUpdateOperationsInput | string
    area?: StringFieldUpdateOperationsInput | string
    especialidade?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: StringFieldUpdateOperationsInput | string
    cenario?: StringFieldUpdateOperationsInput | string
    queixaInicial?: StringFieldUpdateOperationsInput | string
    dadosIniciais?: JsonNullValueInput | InputJsonValue
    anamnese?: JsonNullValueInput | InputJsonValue
    exameFisico?: JsonNullValueInput | InputJsonValue
    sinaisVitais?: JsonNullValueInput | InputJsonValue
    exames?: JsonNullValueInput | InputJsonValue
    evolucao?: JsonNullValueInput | InputJsonValue
    diagnosticoFinal?: StringFieldUpdateOperationsInput | string
    explicacaoDiagnostico?: StringFieldUpdateOperationsInput | string
    diagnosticosDiferenciais?: JsonNullValueInput | InputJsonValue
    pontosChave?: JsonNullValueInput | InputJsonValue
    publicado?: BoolFieldUpdateOperationsInput | boolean
    geradoPorIA?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvestigacaoCasoUpdateWithoutUsuarioInput = {
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    caso?: CasoClinicoUpdateOneRequiredWithoutInvestigacoesNestedInput
    registros?: RegistroInvestigacaoUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registros?: RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    casoId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuestaoCreateManyDisciplinaInput = {
    id?: number
    enunciado: string
    explicacao?: string | null
    tema?: string | null
    dificuldade?: string | null
    createdAt?: Date | string
    usuarioId: number
  }

  export type QuestaoUpdateWithoutDisciplinaInput = {
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutQuestoesNestedInput
    alternativas?: AlternativaUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateWithoutDisciplinaInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
    alternativas?: AlternativaUncheckedUpdateManyWithoutQuestaoNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutQuestaoNestedInput
  }

  export type QuestaoUncheckedUpdateManyWithoutDisciplinaInput = {
    id?: IntFieldUpdateOperationsInput | number
    enunciado?: StringFieldUpdateOperationsInput | string
    explicacao?: NullableStringFieldUpdateOperationsInput | string | null
    tema?: NullableStringFieldUpdateOperationsInput | string | null
    dificuldade?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type AlternativaCreateManyQuestaoInput = {
    id?: number
    texto: string
    correta?: boolean
  }

  export type RespostaCreateManyQuestaoInput = {
    id?: number
    correta: boolean
    respondidaAt?: Date | string
    usuarioId: number
  }

  export type AlternativaUpdateWithoutQuestaoInput = {
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AlternativaUncheckedUpdateWithoutQuestaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AlternativaUncheckedUpdateManyWithoutQuestaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    texto?: StringFieldUpdateOperationsInput | string
    correta?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RespostaUpdateWithoutQuestaoInput = {
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateWithoutQuestaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type RespostaUncheckedUpdateManyWithoutQuestaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    correta?: BoolFieldUpdateOperationsInput | boolean
    respondidaAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: IntFieldUpdateOperationsInput | number
  }

  export type InvestigacaoCasoCreateManyCasoInput = {
    id?: number
    usuarioId: number
    status?: string
    informacoesColetadas: JsonNullValueInput | InputJsonValue
    hipotese?: string | null
    justificativa?: string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExameCasoCreateManyCasoInput = {
    id?: number
    nome: string
    categoria?: string | null
    resultado: string
    interpretacao?: string | null
    disponivel?: boolean
    ordem?: number
    createdAt?: Date | string
  }

  export type InvestigacaoCasoUpdateWithoutCasoInput = {
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneRequiredWithoutInvestigacoesNestedInput
    registros?: RegistroInvestigacaoUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateWithoutCasoInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registros?: RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoNestedInput
  }

  export type InvestigacaoCasoUncheckedUpdateManyWithoutCasoInput = {
    id?: IntFieldUpdateOperationsInput | number
    usuarioId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    informacoesColetadas?: JsonNullValueInput | InputJsonValue
    hipotese?: NullableStringFieldUpdateOperationsInput | string | null
    justificativa?: NullableStringFieldUpdateOperationsInput | string | null
    avaliacao?: NullableJsonNullValueInput | InputJsonValue
    finalizado?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExameCasoUpdateWithoutCasoInput = {
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExameCasoUncheckedUpdateWithoutCasoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExameCasoUncheckedUpdateManyWithoutCasoInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    resultado?: StringFieldUpdateOperationsInput | string
    interpretacao?: NullableStringFieldUpdateOperationsInput | string | null
    disponivel?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoCreateManyInvestigacaoInput = {
    id?: number
    tipo: string
    titulo: string
    pergunta?: string | null
    resposta: string
    ordem: number
    createdAt?: Date | string
  }

  export type RegistroInvestigacaoUpdateWithoutInvestigacaoInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoUncheckedUpdateWithoutInvestigacaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistroInvestigacaoUncheckedUpdateManyWithoutInvestigacaoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    pergunta?: NullableStringFieldUpdateOperationsInput | string | null
    resposta?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}