"use client";

import Image from "next/image";

function Footer() {
  return (
    <div className="bg-card p-5 py-6 border-t">
  <div className="container mx-auto flex justify-between items-center px-8 md:px-16">
    <p className="text-md text-muted-foreground">
      &copy; {new Date().getFullYear()} Municipalidad de Kimbiri. Oficina de Tecnologías de la Información - Seguimiento SGD v.1.0.2
    </p>
    <Image
      src="/images/logo_footer_oscuro.png"
      alt="kimbiri-footer"
      width={200}
      height={50}
      className="w-[200px] h-[50px] object-cover hidden dark:block"
    />
    <Image
      src="/images/logo_footer_claro.png"
      alt="kimbiri-footer"
      width={200}
      height={50}
      className="w-[200px] h-[50px] object-cover dark:hidden"
    />
  </div>
</div>

  );
}

export default Footer;
