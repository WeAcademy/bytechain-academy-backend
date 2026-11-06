/**
 * PostgreSQL behaviour that SQLite hid.
 *
 * The app used to run on SQLite. These tests pin down the places where
 * PostgreSQL behaves differently and the code had to change:
 *
 *  - LIKE is case-sensitive, so searches use ILIKE
 *  - an id that is not a UUID is rejected by the database (must still be a 404)
 *  - DATE(...) returns a Date object, not a string (analytics)
 *  - unquoted camelCase column names are lowercased (notifications update)
 *  - timestamptz columns round-trip exact instants
 *  - GROUP BY is stricter (analytics and course listing queries must run)
 *
 * Requires PostgreSQL at the DB_* variables with migrations applied
 * (`npm run migration:run`); see the README.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { User, UserRole } from '../src/users/entities/user.entity';
import { Course } from '../src/courses/entities/course.entity';
import { Lesson } from '../src/lessons/entities/lesson.entity';
import { Progress } from '../src/progress/entities/progress.entity';
import { Certificate } from '../src/certificates/entities/certificate.entity';
import {
  CurrencyEntry,
  CurrencyType,
} from '../src/currencies/entities/currency-entry.entity';
import {
  Notification,
  NotificationType,
} from '../src/notifications/entities/notification.entity';
import { CurrenciesService } from '../src/currencies/currencies.service';
import { RefreshToken } from '../src/auth/entities/refresh-token.entity';

const PREFIX = '/api/v1';

describe('PostgreSQL query behaviour (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const run = Date.now();
  const password = 'Dialect@123';
  const adminEmail = `admin-dialect-${run}@example.com`;
  const studentEmail = `student-dialect-${run}@example.com`;
  let adminId: string;
  let studentId: string;
  let adminToken: string;
  let studentToken: string;
  let courseId: string;
  let lessonId: string;
  let currencyId: string;
  let certificateId: string;

  const courseTitle = `Zyxwv Dialect Course ${run}`;
  const http = () => request(app.getHttpServer());
  const asAdmin = { Authorization: '' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);

    const admin = await http()
      .post(`${PREFIX}/auth/register`)
      .send({ email: adminEmail, password, name: 'Dialect Admin' })
      .expect(201);
    adminId = admin.body.user.id;
    await dataSource
      .getRepository(User)
      .update(adminId, { role: UserRole.ADMIN });
    // Log in again so the token carries the admin role.
    const login = await http()
      .post(`${PREFIX}/auth/login`)
      .send({ email: adminEmail, password })
      .expect(200);
    adminToken = login.body.accessToken;
    asAdmin.Authorization = `Bearer ${adminToken}`;

    const student = await http()
      .post(`${PREFIX}/auth/register`)
      .send({ email: studentEmail, password, name: 'Dialect Student' })
      .expect(201);
    studentId = student.body.user.id;
    studentToken = student.body.accessToken;

    const course = await dataSource.getRepository(Course).save({
      title: courseTitle,
      description: 'A course used to test PostgreSQL behaviour',
      published: true,
      difficulty: 'Beginner',
      tags: ['Blockchain', 'DeFi'],
    });
    courseId = course.id;
    const lesson = await dataSource.getRepository(Lesson).save({
      title: 'Dialect lesson',
      content: 'x',
      courseId,
      order: 1,
    } as Partial<Lesson>);
    lessonId = lesson.id;
  }, 60_000);

  afterAll(async () => {
    if (dataSource) {
      await dataSource
        .getRepository(Notification)
        .delete({ userId: studentId });
      if (certificateId) {
        await dataSource
          .getRepository(Certificate)
          .delete({ id: certificateId });
      }
      await dataSource.getRepository(Progress).delete({ userId: studentId });
      if (currencyId) {
        await dataSource
          .getRepository(CurrencyEntry)
          .delete({ id: currencyId });
      }
      if (lessonId) await dataSource.getRepository(Lesson).delete(lessonId);
      if (courseId) await dataSource.getRepository(Course).delete(courseId);
      await dataSource
        .getRepository(RefreshToken)
        .delete([{ userId: studentId }, { userId: adminId }]);
      await dataSource.getRepository(User).delete([studentId, adminId]);
    }
    await app.close();
  }, 30_000);

  describe('case-insensitive search (LIKE is case-sensitive on PostgreSQL)', () => {
    it('finds a course by a differently-cased search term', async () => {
      const res = await http()
        .get(`${PREFIX}/courses`)
        .query({ search: 'ZYXWV DIALECT' })
        .expect(200);
      expect(res.body.data.map((c: { id: string }) => c.id)).toContain(
        courseId,
      );
    });

    it('finds a course by a tag regardless of case', async () => {
      const res = await http()
        .get(`${PREFIX}/courses`)
        .query({ search: 'zyxwv', tags: 'blockchain' })
        .expect(200);
      expect(res.body.data.map((c: { id: string }) => c.id)).toContain(
        courseId,
      );

      const none = await http()
        .get(`${PREFIX}/courses`)
        .query({ search: 'zyxwv', tags: 'no-such-tag' })
        .expect(200);
      expect(none.body.data).toEqual([]);
    });

    it('lists courses with pagination and sorting (GROUP BY + skip/take)', async () => {
      for (const sortBy of ['title', 'difficulty', 'createdAt']) {
        const res = await http()
          .get(`${PREFIX}/courses`)
          .query({ page: 1, limit: 1, sortBy, sortOrder: 'asc' })
          .expect(200);
        expect(res.body.data.length).toBeLessThanOrEqual(1);
        expect(typeof res.body.total).toBe('number');
      }
    });

    it('finds a currency by a differently-cased name or symbol', async () => {
      const entry = await dataSource.getRepository(CurrencyEntry).save({
        name: `Qwertyuiop Coin ${run}`,
        symbol: `QW${run}`,
        type: CurrencyType.CRYPTO,
        description: 'test currency',
      });
      currencyId = entry.id;

      // Called on the service: the HTTP route rejects `search` in its query
      // validation (unrelated to the database), so it cannot reach this code.
      const service = app.get(CurrenciesService);
      const find = async (search: string) =>
        JSON.stringify(await service.findAll(undefined, search, {}));

      expect(await find('QWERTYUIOP COIN')).toContain(currencyId);
      expect(await find(`qw${run}`)).toContain(currencyId);
      expect(await find('no-such-currency-xyz')).not.toContain(currencyId);
    });

    it('finds a certificate by a differently-cased recipient (admin)', async () => {
      const cert = await dataSource.getRepository(Certificate).save({
        certificateHash: `hash-${run}`,
        recipientName: 'Zebulon Dialect',
        recipientEmail: studentEmail,
        courseOrProgram: courseTitle,
        certificateData: '{}',
        user: { id: studentId },
        course: { id: courseId },
        issuedAt: new Date('2026-01-15T10:30:00.000Z'),
      } as unknown as Certificate);
      certificateId = cert.id;

      const res = await http()
        .get(`${PREFIX}/certificates/all`)
        .set(asAdmin)
        .query({ search: 'ZEBULON' })
        .expect(200);
      expect(res.body.data.map((c: { id: string }) => c.id)).toContain(
        certificateId,
      );
    });
  });

  describe('ids that are not UUIDs', () => {
    it.each([
      ['GET', `${PREFIX}/courses/not-a-uuid`],
      ['GET', `${PREFIX}/lessons/not-a-uuid`],
      ['PATCH', `${PREFIX}/notifications/not-a-uuid/read`],
    ])('%s %s is a 404, not a 500', async (method, url) => {
      const req = http()[method.toLowerCase() as 'get' | 'patch'](url);
      const res = await req.set({ Authorization: `Bearer ${studentToken}` });
      expect(res.status).toBe(404);
      expect(res.body.message).toBeDefined();
      // The database's own message must not leak to the client.
      expect(JSON.stringify(res.body)).not.toMatch(/uuid|syntax/i);
    });
  });

  describe('analytics (stricter GROUP BY, DATE() as a string)', () => {
    it('reports today as active after a lesson is completed', async () => {
      await dataSource.getRepository(Progress).save({
        userId: studentId,
        courseId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      });

      const res = await http()
        .get(`${PREFIX}/admin/analytics/learner-activity`)
        .set(asAdmin)
        .expect(200);

      const today = new Date().toISOString().slice(0, 10);
      const point = res.body.find((p: { date: string }) => p.date === today);
      expect(point).toBeDefined();
      // Would be 0 if DATE() came back as a Date object and the lookup missed.
      expect(point.activeUsers).toBeGreaterThanOrEqual(1);
    });

    it.each(['overview', 'course-performance', 'top-learners'])(
      'runs the %s queries without a SQL error',
      async (path) => {
        const res = await http()
          .get(`${PREFIX}/admin/analytics/${path}`)
          .set(asAdmin);
        expect(res.status).toBe(200);
      },
    );

    it('returns numbers, not strings, for the aggregates', async () => {
      const res = await http()
        .get(`${PREFIX}/admin/analytics/course-performance`)
        .set(asAdmin)
        .expect(200);
      const row = res.body.find(
        (c: { courseId: string }) => c.courseId === courseId,
      );
      expect(row).toBeDefined();
      expect(typeof row.enrollmentCount).toBe('number');
      expect(typeof row.completionRate).toBe('number');
    });
  });

  describe('notifications', () => {
    it("marks only the caller's unread notifications as read (quoted column names)", async () => {
      const repo = dataSource.getRepository(Notification);
      await repo.save([
        {
          userId: studentId,
          type: NotificationType.NEW_CONTENT,
          message: 'one',
          isRead: false,
        },
        {
          userId: studentId,
          type: NotificationType.NEW_CONTENT,
          message: 'two',
          isRead: false,
        },
        {
          userId: adminId,
          type: NotificationType.NEW_CONTENT,
          message: 'not yours',
          isRead: false,
        },
      ] as Partial<Notification>[]);

      const res = await http()
        .patch(`${PREFIX}/notifications/read-all`)
        .set({ Authorization: `Bearer ${studentToken}` })
        .expect(200);
      expect(res.body.updatedCount).toBe(2);

      expect(await repo.countBy({ userId: studentId, isRead: false })).toBe(0);
      expect(await repo.countBy({ userId: adminId, isRead: false })).toBe(1);
      await repo.delete({ userId: adminId });
    });
  });

  describe('timestamps', () => {
    it('round-trips an exact instant through a timestamptz column', async () => {
      const instant = new Date('2026-03-08T01:30:00.123Z');
      await dataSource
        .getRepository(Certificate)
        .update(certificateId, { issuedAt: instant });
      const cert = await dataSource
        .getRepository(Certificate)
        .findOneByOrFail({ id: certificateId });
      expect(cert.issuedAt.toISOString()).toBe(instant.toISOString());
    });
  });

  it('keeps the schema in sync with the entities (no pending model changes)', async () => {
    const pending = await dataSource.driver.createSchemaBuilder().log();
    expect(pending.upQueries.map((q) => q.query)).toEqual([]);
  });
});
