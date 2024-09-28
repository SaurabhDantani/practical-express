import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg21727507104650 implements MigrationInterface {
    name = 'Mg21727507104650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "Role" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "Otp" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "Otp"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "Role"`);
    }

}
