#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/26cd6a7ed4b23dd803e4a9e3da727fb9b941d1372b5c792b79b88c742b97012e/contract';
import endContract from '../../snapshots/26cd6a7ed4b23dd803e4a9e3da727fb9b941d1372b5c792b79b88c742b97012e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/96ca54ffcf55bd2b0dc42f2eb065a64854a44445b54808c03e19211bf0c7b476/contract';
import startContract from '../../snapshots/96ca54ffcf55bd2b0dc42f2eb065a64854a44445b54808c03e19211bf0c7b476/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('authorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dropNotNull({ schema: 'public', table: 'Post', column: 'author' }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
