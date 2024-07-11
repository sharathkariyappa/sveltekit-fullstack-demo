// import { error } from '@sveltejs/kit';
// let POSTGRES_URL="postgres://default:jFtfp03uzOKw@ep-calm-bonus-a19stl48-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require";
import { createPool, sql } from '@vercel/postgres'
// import { POSTGRES_URL } from '$env/static/private'
let POSTGRES_URL = process.env.POSTGESS_URL;

export async function load() {
  const db = createPool({ connectionString: POSTGRES_URL })

  try {
    const { rows: names } = await db.query('SELECT * FROM names')
    return {
      names: names,
    }
  } catch (error) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const { rows: names } = await db.query('SELECT * FROM names')
      return {
        users: names
      }
    } 
}

async function seed() {
  const db = createPool({ connectionString: POSTGRES_URL })
  const client = await db.connect();
  const createTable = await client.sql`CREATE TABLE IF NOT EXISTS names (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

  console.log(`Created "users" table`)

  const users = await Promise.all([
    client.sql`
          INSERT INTO names (name, email)
          VALUES ('Rohan', 'rohan@tcl.com')
          ON CONFLICT (email) DO NOTHING;
      `,
    client.sql`
          INSERT INTO names (name, email, image)
          VALUES ('Rebecca', 'rebecca@tcl.com')
          ON CONFLICT (email) DO NOTHING;
      `,
    client.sql`
          INSERT INTO names (name, email, image)
          VALUES ('Vivek', 'vivek@gmail.com')
          ON CONFLICT (email) DO NOTHING;
      `,
  ])
  console.log(`Seeded ${users.length} users`)

  return {
    createTable,
    users,
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
	
  update: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();
    const id = data.get('id');  
    const email = data.get('email');
		const name = data.get('name');

    const updateUser = await client.sql`
    UPDATE names
    SET email = ${email}, name = ${name}
    WHERE  id = ${id}   ;`
	
		return { success: true };
	},

  delete: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const id = data.get('id');

    const deleteUser = await client.sql`
    DELETE FROM names
    WHERE id = ${id};`
	
		return { success: true };
	},

	create: async ({request}) => {
		const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL })
    const client = await db.connect();

    const email = data.get('email');
		const name = data.get('name');

    const createUser = await client.sql`
      INSERT INTO names (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO NOTHING;
    `
    return { success: true };
	},

  // update: async ({ request }) => {
  //   const data = await request.formData();
  //   const db = createPool({ connectionString: POSTGRES_URL });
  //   const client = await db.connect();
  
  //   const id = data.get('id');
  //   const email = data.get('email');
  //   const name = data.get('name');
  
  //   try {
  //     await client.query(
  //       `UPDATE names
  //        SET email = $1, name = $2
  //        WHERE id = $3`,
  //       [email, name, id]
  //     );
  //     return { success: true };
  //   } catch (error) {
  //     console.error(error);
  //     return { success: false, error: 'Failed to update user' };
  //   } finally {
  //     await client.release();
  //   }
  // }
};



