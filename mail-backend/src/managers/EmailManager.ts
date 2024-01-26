import { db } from "../db";
// @ts-ignore
import { User, Email } from "@prisma/client";
import Connection from "imap";
import Imap from "imap";
import { simpleParser } from "mailparser";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as quotedPrintable from "quoted-printable";

export default class EmailManager {
  mails = new Map<
    string,
    {
      user: User;
      imap: Connection;
      emails: Email[];
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    }
  >();

  constructor(io: Server) {
    this.init(io);
  }

  async init(io: Server) {
    const users = await db.user.findMany();

    for (const user of users) {
      const imap = new Imap({
        user: user.email,
        password: user.password,
        host: user.imap_server,
        port: Number(user.imap_port),
        tls: true,
        connTimeout: 10000, // Connection timeout in milliseconds (adjust as needed)
        authTimeout: 10000, // Authentication timeout in milliseconds (adjust as needed)
        keepalive: true,
      });
      // IMAP event handling
      const dbEmails = await db.email.findMany({
        where: {
          userId: user.id,
        },
      });
      imap.once("ready", () => {
        imap.openBox("INBOX", true, (err, box) => {
          // @ts-expect-error
          imap.on("mail", async (numNewMessages) => {
            console.log(
              `New emails received for user ${user.email}: ${numNewMessages}`
            );
            const data = await this.getLatestEmail(imap);
            console.log(data);
            // model Email {
            //   id        Int      @id @default(autoincrement())
            //   emailId String
            //   from      String
            //   to        String
            //   subject   String
            //   date      String
            //   body      String
            //   userId    String
            //   createdAt DateTime @default(now())
            //   updatedAt DateTime @updatedAt

            //   // Define a relation to the User model
            //   user User @relation(fields: [userId], references: [id])
            // }
            const e = await db.email.create({
              data: {
                emailId: `${data.attrs.uid}`,
                from: data.header.from[0],
                to: data.header.to[0],
                subject: data.header.subject[0],
                date: data.header.date[0],
                body: data.body,
                userId: user.id,
              },
            });
            console.log(e);
            // return;
            const u = this.mails.get(user.email);
            if (!u) return;
            u.emails.push(e);
            // this.mails.set(user.email, {
            //   ...u,
            //   emails: [
            //     ...u.emails,

            //   ]
            // })
          });
        });
        imap.openBox("TRASH", true, (err, box) => {});
      });
      imap.connect();

      this.mails.set(user.email, {
        user,
        imap,
        emails: dbEmails,
        socket: {} as Socket,
      });
    }
    io.on("connection", (socket) => {
      socket.on("get:emails", async (data) => {
        console.log(data, "GET:EMAILS");
        if (!data.user) return;
        const user = this.mails.get(data.user.email);
        if (!user) return;
        console.log(user, "GET:EMAILS USER");
        socket.emit("getback:emails", user.emails);
      });
      socket.on("get:boxes", async (data) => {
        console.log(data, "GET:EMAILS");
        if (!data.user) return;
        const user = this.mails.get(data.user.email);
        if (!user) return;
        console.log(user, "GET:EMAILS USER");
        user.imap.getBoxes((err, boxes) => {
          console.log({ boxes });
          socket.emit("getback:boxes", boxes);
        });
      });
      socket.on("user", async (data) => {
        if (!data.user) return;
        const user = this.mails.get(data.user.email);
        if (!user) return;
        this.mails.set(data.user.email, {
          ...user,
          socket,
        });
      });
    });
    // const emails = await this.fetchNextPage(
    //   1,
    //   50,
    //   this.mails.get("nagariawaleed@gmail.com")?.imap!,
    //   50
    // );

    // setTimeout(() => {
    //   // @ts-ignore
    //   console.log(emails, "EMAILS");
    // }, 1000);
  }

  async getLatestEmail(imap: Connection): Promise<any> {
    let email: any;
    return new Promise((resolve, reject) => {
      const searchCriteria = ["UNSEEN"]; // You can customize the criteria based on your needs
      const fetchOptions: Imap.FetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "2"],
        markSeen: true, // Mark emails as seen
        struct: true,
      };

      imap.search(searchCriteria, (err: Error, results: any) => {
        if (results.length === 0) {
          console.log("No new emails found.");
          return;
        }

        results = results[results.length - 1];

        const fetch = imap.fetch(results, fetchOptions);

        fetch.on("message", (msg, seqno) => {
          console.log("Message #%d", seqno);
          let body = "";
          let header = "";
          let parsedMsg: any = {};

          msg.on("body", (stream, info) => {
            if (info.which === "2" || info.which === "TEXT") {
              stream.on("data", function (chunk) {
                console.log(chunk, "CHUNK");
                body += chunk.toString("utf8");
              });
              stream.once("end", function () {
                // @ts-ignore
                parsedMsg.body = quotedPrintable.decode(body);
              });
            } else {
              stream.on("data", function (chunk) {
                header += chunk.toString("utf8");
              });
              stream.once("end", function () {
                // @ts-ignore
                parsedMsg.header = Imap.parseHeader(header);
              });
            }
          });

          msg.once("attributes", (attrs) => {
            // Additional information about the email structure
            // messageData.structure = attrs.struct;
            // console.log({ attrs });

            // // Access other attributes if needed
            // console.log(
            //   prefix + "Attributes:",
            //   inspect(attrs, false, null, true)
            // );
            parsedMsg.attrs = attrs;
          });

          msg.once("end", () => {
            email = parsedMsg;
          });
        });

        fetch.on("error", (err) => {
          if (err.message.includes("Some messages could not be FETCHed")) {
            console.warn(
              "Some messages could not be FETCHed. Continuing with the remaining messages."
            );
          } else {
            console.error("Fetch error:", err);
          }
        });

        fetch.once("end", () => {
          console.log("Done fetching the latest message!");
          // Close the connection when done fetching emails
          // imap.end();
          // Return the emails to the caller
          resolve(email);
          // console.log({ emails });
        });
      });
    });
  }

  openInbox(imap: Imap, cb: (err: Error | null, box: any) => void) {
    imap.openBox("INBOX", true, cb);
  }
  fetchNextPage(
    currentPage: number,
    PAGE_SIZE: number,
    imap: Connection,
    TOTAL_EMAILS: number
  ) {
    const emails: {
      header: {
        from: string[];
        to: string[];
        subject: string[];
        date: string[];
      };
      body: string;
      attrs: any;
    }[] = [];
    return new Promise((resolve, reject) => {
      const toSeqNo = TOTAL_EMAILS - (currentPage - 1) * PAGE_SIZE;
      const fromSeqNo = toSeqNo - PAGE_SIZE + 1;

      const fetchOptions: Imap.FetchOptions = {
        bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "2"],
        markSeen: false,
        struct: true,
      };

      const searchCriteria = [`${fromSeqNo}:${toSeqNo}`];

      imap.once("ready", () => {
        this.openInbox(imap, (err: Error | null, box: any) => {
          imap.search(searchCriteria, (err, results) => {
            // console.log({ results });
            if (err) {
              console.error("Error searching for emails:", err);
            }

            if (results.length === 0) {
              console.log("No more emails to fetch.");
              return emails;
            }

            const fetch = imap.seq.fetch(results, fetchOptions);

            fetch.on("message", (msg, seqno) => {
              console.log("Message #%d", seqno);
              let prefix = "(#" + seqno + ") ";
              let body = "";
              let header = "";
              let parsedMsg: any = {};

              let messageData: any = {};

              msg.on("body", (stream, info) => {
                if (info.which === "2" || info.which === "TEXT") {
                  stream.on("data", function (chunk) {
                    body += chunk.toString("utf8");
                  });
                  stream.once("end", function () {
                    // @ts-ignore
                    parsedMsg.body = body;
                  });
                } else {
                  stream.on("data", function (chunk) {
                    header += chunk.toString("utf8");
                  });
                  stream.once("end", function () {
                    // @ts-ignore
                    parsedMsg.header = Imap.parseHeader(header);
                  });
                }
              });

              msg.once("attributes", (attrs) => {
                // Additional information about the email structure
                // messageData.structure = attrs.struct;
                // console.log({ attrs });

                // // Access other attributes if needed
                // console.log(
                //   prefix + "Attributes:",
                //   inspect(attrs, false, null, true)
                // );
                parsedMsg.attrs = attrs;
              });

              msg.once("end", () => {
                emails.push(parsedMsg);
              });
            });

            fetch.on("error", (err) => {
              if (err.message.includes("Some messages could not be FETCHed")) {
                console.warn(
                  "Some messages could not be FETCHed. Continuing with the remaining messages."
                );
              } else {
                console.error("Fetch error:", err);
              }
            });

            fetch.once("end", () => {
              console.log("Done fetching the latest message!");
              // Close the connection when done fetching emails
              // imap.end();
              // Return the emails to the caller
              resolve(emails);
              // console.log({ emails });
            });
          });
        });
      });

      imap.once("error", (err: any) => {
        console.error(err);
      });

      imap.once("end", () => {
        console.log("IMAP Connection ended");
        return emails;
      });

      imap.connect();
    });
  }
}
