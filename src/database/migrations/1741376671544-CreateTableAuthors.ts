import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class autores1737390083229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "authors",
        columns: [
          {
            name: "id",
            isPrimary: true,
            isGenerated: true,
            type: "int",
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "birthdate",
            type: "date",
          },
          {
            name: "biography",
            type: "varchar",
          },
          {
            name: "nationality",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "active",
            type: "boolean",
            default: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("authors");
  }
}
