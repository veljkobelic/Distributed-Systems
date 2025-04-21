---
title: Assignment 2 se-group-04
---

```mermaid
erDiagram
    Job ||--o{ Application : "has many"
    Company ||--o{ Job : "posts"
    User ||--o{ Application : "submits"

    Job {
        string id
        string title
        string description
        string location
        string type
        date posted_date
    }

    Company {
        string id
        string name
        string description
    }

    User {
        string id
        string name
        string email
    }

    Application {
        string id
        date submitted_date
        string status
    }