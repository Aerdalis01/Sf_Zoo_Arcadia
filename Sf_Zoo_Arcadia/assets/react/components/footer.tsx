const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer">
      <section className=" bg-primary pt-2">
        <div className="container text-center mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h3 className="text-uppercase fw-bold">Zoo Arcadia</h3>
              <a href="#header">
                <img
                  className="footer-logo mb-4 mt-0 d-inline-block mx-auto"
                  src="/uploads/images/svgDeco/Logo.svg"
                  alt="Logo Zoo Arcadia"
                />
              </a>
              <div>
                <a href="/">
                  <img src="/uploads/images/svgDeco/fb.svg" alt="logo facebook" />
                </a>
                <a href="/">
                  <img src="/uploads/images/svgDeco/inst.svg" alt="logo instagram" />
                </a>
                <a href="/">
                  <img
                    src="/uploads/images/svgDeco/youtube.svg"
                    alt="logo youtube"
                  />
                </a>
                <a href="/">
                  <img src="/uploads/images/svgDeco/twit.svg" alt="logo twiter" />
                </a>
              </div>
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold">Services</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" />
              <p>
                <a href="#restaurations" className="text-white">
                  Restaurations
                </a>
              </p>
              <p>
                <a href="#visite" className="text-white">
                  Visite guidée
                </a>
              </p>
              <p>
                <a href="#train" className="text-white">
                  Visite en petit train
                </a>
              </p>
            </div>

            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold">Habitats</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" />

              <p>
                <a href="/marais" className="text-white">
                  Marais
                </a>
              </p>
              <p>
                <a href="/savane" className="text-white">
                  Savane
                </a>
              </p>
              <p>
                <a href="/jungle" className="text-white">
                  Jungle
                </a>
              </p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold">Nous contacter</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" />
              <p className="text-white"> Borcéliande, 13 rue du zooq, France</p>
              <p className="text-white"> info@example.com</p>
              <p className="text-white"> + 01 234 567 88</p>
              <p className="text-white"> + 01 234 567 89</p>
            </div>
          </div>
          <div className="text-center p-3">
            © 2024 Copyright:
            <a className="text-white" href="https://Zoo Arcadia.com/">
              ZooArcadia.com
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};


export default Footer;