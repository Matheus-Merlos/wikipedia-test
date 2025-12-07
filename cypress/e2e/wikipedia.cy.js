describe('Cenários de teste da Wikipedia', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080) 
        cy.visit('https://pt.wikipedia.org/')

        cy.get('#searchInput', { timeout: 10000 }).should('be.visible')
    })

    it('WIKI-01 - Busca por texto usando o campo principal + Enter', () => {
        cy.get('#searchInput').type("Brasil", { delay: 100 })
        cy.get('#searchInput').type('{enter}', { force: true })

        cy.url().should('include', '/wiki/Brasil')
        cy.get('#firstHeading').should('have.text', 'Brasil')
    })

    it('WIKI-02 - Busca por texto clicando no ícone/lupa', () => {
        cy.get('#searchInput').type('JavaScript', { delay: 100 })
        cy.wait(500)
        cy.get('form#searchform').submit()

        cy.url().should('include', '/wiki/JavaScript')
        cy.get('#firstHeading').should('have.text', 'JavaScript')
    })

    it('WIKI-03 - Autocomplete exibe sugestões relevantes', () => {
        cy.get('#searchInput').type('Mach', { delay: 300 })

        cy.get('.cdx-menu__listbox').should('be.visible')
        cy.get('.cdx-menu-item').should('have.length.at.least', 1).then($links => {
            const textos = [...$links].map(el => el.innerText.toLowerCase())

            expect(textos.some(t => t.includes('machado de assis') || t.includes('machu picchu')),
                'Pelo menos uma sugestão deve conter "Machado de Assis" ou "Machu Picchu"'
            ).to.be.true
        })
    })

    it('WIKI-04 - Autocomplete seleciona item com clique', () => {
        cy.get('#searchInput').type('Rio de', { delay: 300 })
        cy.get('.cdx-menu__listbox').should('be.visible')
        cy.get('.cdx-menu-item').first().click()

        cy.url().should('include', '/wiki/Rio_de_Janeiro')
        cy.get('#firstHeading').should('have.text', 'Rio de Janeiro')
    })

    it('WIKI-05 - Menu hamburger abre e fecha', () => {
        cy.get('#vector-main-menu-dropdown-checkbox').click()
        cy.get('.vector-dropdown-content').should('be.visible')

        cy.get('#vector-main-menu-dropdown-checkbox').click()
        cy.get('.vector-dropdown-content').should('not.be.visible')
    })

    it('WIKI-06 - Mudança de idioma para Inglês', () => {
        cy.get('#searchInput').type("Brasil", { delay: 100 })
        cy.get('#searchInput').type('{enter}', { force: true })
        cy.get('#p-lang-btn-checkbox').click()
        cy.contains("English").click()

        cy.url().should('include', 'en.wikipedia.org')
    })

    it('WIKI-07 - Mudança de idioma para Espanhol', () => {
        cy.get('#searchInput').type("Brasil", { delay: 100 })
        cy.get('#searchInput').type('{enter}', { force: true })
        cy.get('#p-lang-btn-checkbox').click()
        cy.contains("Español").click()

        cy.url().should('include', 'es.wikipedia.org')
    })

    it('WIKI-08 - Alternar para modo escuro (tema noturno)', () => {
        cy.contains('Escuro').click()

        cy.get('html').should('have.class', 'skin-theme-clientpref-night')
    })

    it('WIKI-09 - Alternar de volta para modo claro', () => {
        cy.contains('Claro').click()

        cy.get('html').should('have.class', 'skin-theme-clientpref-day')
    })

    it('WIKI-10 - Navegação entre abas Artigo → Discussão', () => {
        cy.get('#searchInput').type("Cavalo", { delay: 100 })
        cy.get('#searchInput').type('{enter}', { force: true })
        cy.contains('Discussão').click()

        cy.url().should('include', '/wiki/Discuss%C3%A3o:Cavalo')
        cy.get('#firstHeading').should('have.text', 'Discussão:Cavalo')
    })

    it('WIKI-11 - Navegação entre abas Discussão → Artigo', () => {
        cy.get('#searchInput').type("Cavalo", { delay: 100 })
        cy.get('#searchInput').type('{enter}', { force: true })
        cy.contains('Discussão').click()
        cy.contains('Artigo').click()

        cy.url().should('include', '/wiki/Cavalo')
        cy.get('#firstHeading').should('have.text', 'Cavalo')
    })
})
