// import { MigrationInterface, QueryRunner } from "typeorm";

// export class Mg11727513801978 implements MigrationInterface {
//     name = 'Mg11727513801978'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "Users" ("Id" SERIAL NOT NULL, "FirstName" character varying(100) NOT NULL, "LastName" character varying(100), "Email" character varying(100) NOT NULL, "Password" character varying(255) NOT NULL, "Role" character varying(100) NOT NULL, "IsVerify" bit DEFAULT '0', CONSTRAINT "UQ_884fdf47515c24dbbf6d89c2d84" UNIQUE ("Email"), CONSTRAINT "PK_329bb2946729a51bd2b19a5159f" PRIMARY KEY ("Id"))`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DROP TABLE "Users"`);
//     }

// }
