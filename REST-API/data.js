// Das ist die Datenquelle, die wir in diesem Beispiel verwenden.

const jobs = {
    job1: {
      id: "job1",
      title: "Software Engineer",
      description: "Develop web applications using modern technologies",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2024-10-15",
      companyId: "company1"
    },
    job2: {
      id: "job2",
      title: "Data Analyst",
      description: "Analyze and interpret complex data sets",
      location: "New York, NY",
      type: "Part-time",
      postedDate: "2024-10-16",
      companyId: "company2"
    },
    job3: {
      id: "job3",
      title: "Product Manager",
      description: "Lead product development from concept to launch",
      location: "Seattle, WA",
      type: "Full-time",
      postedDate: "2024-10-17",
      companyId: "company1"
    }
  };
  
  const companies = {
    company1: {
      id: "company1",
      name: "TechCorp",
      description: "Leading technology company"
    },
    company2: {
      id: "company2",
      name: "DataInsights",
      description: "Data analytics firm"
    }
  };
  
  const users = {
    user1: {
      id: "user1",
      name: "Alice Johnson",
      email: "alice@example.com"
    },
    user2: {
      id: "user2",
      name: "Bob Smith",
      email: "bob@example.com"
    }
  };
  
  const applications = {
    app1: {
      id: "app1",
      jobId: "job1",
      userId: "user1",
      submittedDate: "2024-10-16",
      status: "Submitted"
    }
  };
  
  module.exports = { jobs, companies, users, applications };