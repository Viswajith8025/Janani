import request from 'supertest';
import app from '../../backend/app.js'; // Ensure app is exported in backend/app.js for testing

describe('POST /api/v1/booking', () => {
  it('should reject malformed JSON/NoSQL injection payloads', async () => {
    const res = await request(app)
      .post('/api/v1/booking')
      .send({
        firstName: { "$gt": "" }, // NoSQL injection attempt
        email: "invalid-email",
        totalGuests: -1 // Invalid bounds
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Validation Error');
  });

  it('should enforce rate limits on excessive requests', async () => {
    // Fire 6 requests in rapid succession (limit is 5)
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v1/booking').send({});
    }
    const res = await request(app).post('/api/v1/booking').send({});
    
    expect(res.status).toBe(429); // Too Many Requests
  });
});

describe('GET /api/v1/bookings (Protected Admin Route)', () => {
  it('should return 401 Unauthorized for missing JWT', async () => {
    const res = await request(app).get('/api/v1/bookings');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });
});
