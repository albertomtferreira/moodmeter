import NavBar from "../(landing)/_components/NavBar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className="flex-center min-h-screen w-full bg-background bg-cover bg-fixed bg-center">
        {children}
      </div>
    </>

  )
}

export default Layout