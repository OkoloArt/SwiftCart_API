import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1711643379967 implements MigrationInterface {
    name = ' $npmConfigName1711643379967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userCart" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userCart"`);
    }

}
