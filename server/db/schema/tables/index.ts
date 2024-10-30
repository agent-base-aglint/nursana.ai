import type { Custom, CustomizableTypes } from '@/app/types';

import type { Database } from '../default';

type DatabaseTables = Database['public']['Tables'];
type DatabaseTableInsert<T extends keyof DatabaseTables> =
  DatabaseTables[T]['Insert'];
type DatabaseTableRow<T extends keyof DatabaseTables> =
  DatabaseTables[T]['Row'];
type DatabaseTableUpdate<T extends keyof DatabaseTables> =
  DatabaseTables[T]['Update'];
type DatabaseTableRelationships<T extends keyof DatabaseTables> =
  DatabaseTables[T]['Relationships'];

export type TableType<
  T extends keyof DatabaseTables,
  U extends DatabaseTableRow<T> extends CustomizableTypes<'Array'>
    ? { [_id in keyof Partial<DatabaseTableRow<T>[number]>]: any }
    : { [_id in keyof Partial<DatabaseTableRow<T>>]: any },
> = Required<
  Custom<
    DatabaseTables[T],
    //@ts-expect-error
    {
      Row: Custom<DatabaseTableRow<T>, U>;
      Insert: Custom<DatabaseTableInsert<T>, U>;
      Update: Custom<DatabaseTableUpdate<T>, U>;
      Relationships: DatabaseTableRelationships<T>;
    }
  >
>;

export type Tables = Custom<DatabaseTables, {}>;
