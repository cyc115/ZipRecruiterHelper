# JobHounter


Scraps jobs from popular job sites (currently only ZipRecruiter) and automatically extracts keywords from job description.

## current state 

Able to search a job title and extract relevent information including keywords from the jobs returned from the query.

The first page of the search with "Fullstack" and posted in the past 3 days returns the following.

```
job list length : 20
---- FullStack Developer
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Developer Associate Manager
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack JavaScript Engineer Senior Analyst
---- Fullstack Developer
---- # Sr. FullStack Java/J2EE Developer | Chicago, IL | 12+ months
---- Senior Fullstack Engineer
---- Fullstack Java Developer (Struts, EJB,HTML,CSS,JavaScript)- Only W2
---- Fullstack Developer - C# Azure
----
FullStack Developer
[ 'css', 'function', 'date', 'select', 'canvas', 'web', 'input' ]
Fullstack JavaScript Developer Associate Manager
[ 'javascript',
  'python',
  'html',
  'css',
  'node.js',
  'api',
  'testing',
  'join',
  'web',
  'twitter',
  'methods',
  'design' ]
Fullstack Developer
[]
# Sr. FullStack Java/J2EE Developer | Chicago, IL | 12+ months
[ 'javascript',
  'angularjs',
  'spring',
  'rest',
  'security',
  'object',
  'web' ]
Senior Fullstack Engineer
[ 'function', 'date', 'select', 'canvas', 'input' ]
Fullstack Java Developer (Struts, EJB,HTML,CSS,JavaScript)- Only W2
[ 'function', 'date', 'select', 'canvas', 'input' ]

...
```

See how to make a query, refer to index.js

# TODO

- implement a web front end that allows users (job seekers) to filter jobs by keywords. An example filter would be '["java", "javascript", "nodejs" , "angularjs"]. only jobs with relevant requirements will show up first.