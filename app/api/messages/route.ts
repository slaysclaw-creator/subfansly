import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET messages (conversations)
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const recipientId = new URL(req.url).searchParams.get('recipientId');

    if (!recipientId) {
      // Get all conversations
      const result = await query(
        `SELECT DISTINCT ON (CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END)
                CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END as other_user_id,
                u.username, u.avatar_url,
                m.content, m.created_at
         FROM messages m
         JOIN users u ON (CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END) = u.id
         WHERE m.sender_id = $1 OR m.recipient_id = $1
         ORDER BY other_user_id, m.created_at DESC`,
        [payload.userId]
      );

      return NextResponse.json({ conversations: result.rows }, { status: 200 });
    }

    // Get messages with specific user
    const result = await query(
      `SELECT m.id, m.sender_id, m.recipient_id, m.content, m.is_read, m.created_at,
              u.username
       FROM messages m
       JOIN users u ON (CASE WHEN m.sender_id = $1 THEN m.sender_id ELSE m.recipient_id END) = u.id
       WHERE (m.sender_id = $1 AND m.recipient_id = $2) OR (m.sender_id = $2 AND m.recipient_id = $1)
       ORDER BY m.created_at DESC`,
      [payload.userId, parseInt(recipientId)]
    );

    return NextResponse.json({ messages: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST send message
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if sender has subscription to recipient (if recipient is a creator)
    const creatorCheck = await query(
      'SELECT id FROM creators WHERE user_id = $1',
      [recipientId]
    );

    if (creatorCheck.rows.length > 0) {
      const creatorId = creatorCheck.rows[0].id;
      const subscriptionCheck = await query(
        'SELECT id FROM subscriptions WHERE user_id = $1 AND creator_id = $2 AND is_active = true',
        [payload.userId, creatorId]
      );

      if (subscriptionCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'You must subscribe to message this creator' },
          { status: 403 }
        );
      }
    }

    const result = await query(
      `INSERT INTO messages (sender_id, recipient_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, recipient_id, content, created_at`,
      [payload.userId, recipientId, content]
    );

    return NextResponse.json(
      { message: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

