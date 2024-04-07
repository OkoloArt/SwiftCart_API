import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712357587957 implements MigrationInterface {
    name = ' $npmConfigName1712357587957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_userrole_enum" AS ENUM('SELLER', 'BUYER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userRole" "public"."user_userrole_enum" NOT NULL DEFAULT 'BUYER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userRole"`);
        await queryRunner.query(`DROP TYPE "public"."user_userrole_enum"`);
    }

}
