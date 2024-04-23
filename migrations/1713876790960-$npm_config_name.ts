import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713876790960 implements MigrationInterface {
    name = ' $npmConfigName1713876790960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profile" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile"`);
    }

}
