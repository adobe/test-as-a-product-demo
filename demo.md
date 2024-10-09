# Demo Steps

## 0-Describe Problems

- Problems with data (server.js)
- UI Validations or non-validations
  - Check that the Data is there
  - Better validations of Comments
  - Better validations of upvotes (optional)

## 1-Stop Everyting

Ensure Every service is Stopped
() Set server to default

## 3-Start Everything

Start:

- Node Back-end
- Front-end
- Bridge Service

`mvn compile exec:java -Dexec.mainClass=MainContainer -Dexec.args="test"`

## 4-Getting the test to pass

```
Given I already have old comments for the article "learn-german"
```

```JS
Given('I already have old comments for the article {string}', (text) => {
  let calls = {
    callContent: {
      addComment: {
        class: 'com.bridgeservice.demo.backend.MyBlogBackEnd',
        method: 'addCommentToArticle',
        args: ['http://localhost:8000/', faker.person.fullName(), faker.lorem.paragraph(), text],
      },
    },
  }
  cy.task('bridgeService', calls).then((result) => {
    expect(result.returnValues).to.not.be.empty
    expect(result.returnValues.addComment).to.equal(true);
  })
});
```

## 5-Ensuring Data is there

Ensuring data is there

```
    Given there is an article "learn-german" in the system
```

```JS
Given("there is an article {string} in the system", (text) => {
  let call = {
    callContent: {
      article: {
        class: "com.bridgeservice.demo.backend.MyBlogBackEnd",
        method: "fetchArticle",
        args: ["http://localhost:8000/", text],
      },
    },
  };
  cy.task("bridgeService", call).then((result) => {
    expect(result.returnValues.article).to.not.be.empty;
  });
});

```

## 5-Making validation non-ui-driven

Ensuring comments are there (Add to "I should be able to add a comment"):

```JS
  let call = {
    callContent: {
      article: {
        class: "com.bridgeservice.demo.backend.MyBlogBackEnd",
        method: "fetchLastComment",
        args: ["http://localhost:8000/", this.selectedArticle],
      },
    },
  };

  cy.task("bridgeService", call).then((result) => {
    expect(result.returnValues.article).to.not.be.empty;
    const resultData = result.returnValues.article;

    expect(Object.keys(resultData)).to.include.members(["postedBy", "text"]);

    expect(resultData.postedBy).to.equal(name);
    expect(resultData.text).to.equal(text);
  });
```

## 6-Successful upvote

Ensuring upvote has been successfull:

```JS
  Then("I should successfully upvote the article", () => {
  let call = {
    callContent: {
      article: {
        class: "com.bridgeservice.demo.backend.MyBlogBackEnd",
        method: "fetchArticle",
        args: ["http://localhost:8000/", this.selectedArticle],
      },
    },
  };

  cy.task("bridgeService", call)
    .then((result) => {
      expect(result.returnValues.article).to.not.be.empty;
      expect(result.returnValues.article.upvotes).to.be.a("number");
      return result.returnValues.article.upvotes;
    })
    .then((votesBefore) => {
      //Add backend check
      cy.get('button[data-testid="upvote-button"]')
        .should("exist")
        .click()
        .then(() => {
          cy.task("bridgeService", call).then((result2) => {
            expect(result2.returnValues.article).to.not.be.empty;
            expect(result2.returnValues.article.upvotes).to.equal(
              votesBefore + 1
            );
          });
        });
    });
```
