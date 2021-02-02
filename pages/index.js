import Head from "next/head";
import styles from "../styles/Home.module.css";
import request from "graphql-request";
import useSWR from "swr";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://nextjs-prisma-tut.vercel.app/api";

export default function Home() {
  console.log("API:", API);

  const { data, error } = useSWR(
    /* GraphQL */ `
      {
        users {
          id
          firstName
          lastName
          age
          img
        }
      }
    `,
    (query) => request(API, query)
  );

  if (error) return <div>failed to load</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        {!data ? (
          <div>loading...</div>
        ) : (
          <div className={styles.grid}>
            {data.users.map((user) => (
              <div key={user.id} className={styles.card}>
                <img src={user.img} alt="avatar" />
                <p>First Name: {user.firstName}</p>
                <p>Last Name: {user.lastName}</p>
                <p>Age: {user.age}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
