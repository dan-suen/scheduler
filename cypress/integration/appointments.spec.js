describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/");
  
    cy.contains("Monday");
  })
  it("should book an interview", () => {
    cy.get("[alt=Add]").first().click()

    cy.get("[data-testid=student-name-input]")
    .type('Lydia Miller-Jones', {delay: 200})
    .should("have.value", 'Lydia Miller-Jones')

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  })
  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
    .first()
    .click({force : true })

    cy.get("[data-testid=interviewer-pic]").find("[alt='Tori Malcolm']").click()

    cy.get("[data-testid=student-name-input]")
    .clear()
    .type('Hello', {delay: 200})

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Hello");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })
  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
    .first()
    .click({force : true })

    cy.get(".appointment__actions").contains("Confirm").click()

    cy.contains("Deleting").should("exist")
    cy.contains("Deleting").should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
  })
})