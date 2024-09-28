import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg31727507378970 implements MigrationInterface {
    name = 'Mg31727507378970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" RENAME COLUMN "EmailAddress" TO "Email"`);
        await queryRunner.query(`ALTER TABLE "Users" RENAME CONSTRAINT "UQ_29aff9ad234d81648bdda5d7f1e" TO "UQ_884fdf47515c24dbbf6d89c2d84"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" RENAME CONSTRAINT "UQ_884fdf47515c24dbbf6d89c2d84" TO "UQ_29aff9ad234d81648bdda5d7f1e"`);
        await queryRunner.query(`ALTER TABLE "Users" RENAME COLUMN "Email" TO "EmailAddress"`);
    }

}
