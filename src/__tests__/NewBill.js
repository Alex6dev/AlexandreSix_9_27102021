import { screen,fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from "@testing-library/user-event"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("then,i would like to change the file and get no error message",()=>{
      const html = NewBillUI() 
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname }) 
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore:null,
        localStorage: window.localStorage
      })
      const handleChangeFile= jest.fn(e=>newBill.handleChangeFile(e)) 
      const btnFile= screen.getByTestId("file")
      btnFile.addEventListener('change',handleChangeFile)
      fireEvent.change(btnFile, { target : {files: [new File (["test.jpg"],"test.jpg", {type:'image/jpg'})]}  }) 
      expect(handleChangeFile).toHaveBeenCalled()  
      const box=screen.getByTestId('box')
      expect(box.innerHTML).toBeNull()
    })
    /*test("then,",()=>{
      const box=screen.getByTestId('box')
    })*/
  })
})