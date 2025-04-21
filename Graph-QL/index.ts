import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

// Liest die GraphQL-Schema-Datei ein und speichert sie als String
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// Beispiel-Daten für Companies 
const companies = [
  { id: "1", name: "Tech Corp", description: "Software company" },
  { id: "2", name: "Design Studio", description: "Creative agency" }
];

// Beispiel-Daten für Users
const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" }
];

// Beispiel-Daten für Jobs
const jobs = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "Work on React applications",
    location: "Remote",
    type: "Full-time",
    posted_date: "2025-04-01",
    companyId: "1"
  },
  {
    id: "2",
    title: "UX Designer",
    description: "Design modern user interfaces",
    location: "Berlin",
    type: "Part-time",
    posted_date: "2025-03-28",
    companyId: "2"
  }
];

// Beispiel-Daten für Applications
const applications = [
  {
    id: "1",
    submitted_date: "2025-04-05",
    status: "Pending",
    jobId: "1",
    userId: "2"
  }
];

// Resolver definieren, wie GraphQL-Anfragen verarbeitet werden
const resolvers = {
  Query: {
    // Gibt alle Jobs zurück
    jobs: () => jobs,
    // Gibt einen bestimmten Job anhand der ID zurück
    job: (_: any, { id }: { id: string }) => jobs.find(job => job.id === id),
    // Gibt alle Bewerbungen für einen bestimmten Job zurück
    applicationsForJob: (_: any, { jobId }: { jobId: string }) =>
      applications.filter(app => app.jobId === jobId),
  },
  Mutation: {
    // Erstellt einen neuen Job und fügt ihn der Liste hinzu
    createJob: (_: any, { input }: any) => {
      const newJob = {
        id: (jobs.length + 1).toString(),
        ...input,
        posted_date: new Date().toISOString().split("T")[0]
      };
      jobs.push(newJob);
      return newJob;
    },
    // Reicht eine Bewerbung ein
    submitApplication: (_: any, { jobId, userId }: any) => {
      const newApp = {
        id: (applications.length + 1).toString(),
        submitted_date: new Date().toISOString().split("T")[0],
        status: "Pending",
        jobId,
        userId
      };
      applications.push(newApp);
      return newApp;
    }
  },
  // Verknüpfung: Jeder Job kennt seine Company
  Job: {
    company: (parent: any) => companies.find(c => c.id === parent.companyId)
  },
  // Verknüpfung: Jede Bewerbung kennt den User und den Job
  Application: {
    user: (parent: any) => users.find(u => u.id === parent.userId),
    job: (parent: any) => jobs.find(j => j.id === parent.jobId)
  }
};
// Initialisiert den Apollo Server mit dem Schema und den Resolvern
const server = new ApolloServer({
  typeDefs,
  resolvers
});
// Startet den Server und gibt die URL in der Konsole aus
async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`🚀 Server ready at: ${url}`);
}
// Führt Startfunktion aus
main();