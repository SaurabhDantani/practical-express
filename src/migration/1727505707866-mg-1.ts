import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg11727505707866 implements MigrationInterface {
    name = 'Mg11727505707866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("Id" SERIAL NOT NULL, "FirstName" character varying(100) NOT NULL, "LastName" character varying(100), "EmailAddress" character varying(100) NOT NULL, "Password" character varying(255) NOT NULL, CONSTRAINT "UQ_29aff9ad234d81648bdda5d7f1e" UNIQUE ("EmailAddress"), CONSTRAINT "PK_329bb2946729a51bd2b19a5159f" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
