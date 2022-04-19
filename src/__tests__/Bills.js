/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom"
import {screen, waitFor, getByTestId , getAllByTestId, fireEvent} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //console.log(JSON.stringify(windowIcon.classList))
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on the icon eye of a bill", () => {
    test(("Then a modal should be opened"), () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const getBills = new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const iconEyes = screen.getAllByTestId('icon-eye')
      const handleClickIconEye0 = jest.fn(getBills.handleClickIconEye(iconEyes[0]))
      iconEyes[0].addEventListener('click', handleClickIconEye0)
      fireEvent.click(iconEyes[0])
      expect(handleClickIconEye0).toHaveBeenCalled()
      const modale = screen.getByTestId('modale-file')
      expect(modale).toBeTruthy()
    })
  })
  
  describe("When I click on the New Bill button", () => {
    test(("Then I get on the New Bill page"), () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const getBills = new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const newBillBtn = screen.getByTestId('btn-new-bill')
      const handleClickNewBillButton = jest.fn(getBills.handleClickNewBill())
      newBillBtn.addEventListener('click', handleClickNewBillButton)
      fireEvent.click(newBillBtn) 
      expect(handleClickNewBillButton).toHaveBeenCalled()
      const newBillPageTitle = screen.getByText('Envoyer une note de frais')
      expect(newBillPageTitle).toBeTruthy()
    })
  })
  //intégration api GET
  describe("When I am on Bills page", () => {
    describe("When I am on Bills page", () => {
    
      //Lorsqu'une erreur se produit sur l'API
      describe("When an error occurs on API", () => {
        // beforeEach()est exécuté avant chaque test describe. gère le code Asynchrone / portée plus grande
        // Jest.spyOn simule la fonction qu'on a besoin et conserve l'implémentation d'origine. mock une méthode dans un objet.
        beforeEach(() => {
          jest.spyOn(mockStore, "bills")
          Object.defineProperty(window,'localStorage',{ value: localStorageMock })
          localStorage.setItem('user', JSON.stringify({type: 'Employee', email: "a@a"}))
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.appendChild(root)
          router()
        })
        // TEST : récupère les factures d'une API et échoue avec une erreur 404
        test("fetches bills from an API and fails with 404 message error", async () => {
            // mockImplementationOnce : récupère la boucle une fois
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 404"))
              }
            }})
          const html = BillsUI({ error: "Erreur 404" });
          document.body.innerHTML = html;
          const message = await screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        })
        
        // TEST : récupère les factures d'une API et échoue avec une erreur 500
        test("fetches messages from an API and fails with 500 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 500"))
              }
            }})
          const html = BillsUI({ error: "Erreur 500" });
          document.body.innerHTML = html;
          const message = await screen.getByText(/Erreur 500/);
          expect(message).toBeTruthy();
        })
      })
    })
  })
})

