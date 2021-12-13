---
title: Primeros Pasos
feedbackID: 00-PrimerosPasos
permalink: /Primeros_Pasos/
eleventyNavigation:
  key: Primeros Pasos
  order: 1
---

![HenryLogo](/_src/assets/logo.png)

<table class="feedback" width="100%" style='table-layout:fixed;'>
  <tr>
    <td>
      <a href="https://airtable.com/shrSzEYT4idEFGB8d?prefill_clase=00-PrimerosPasos">
        <img src="https://static.thenounproject.com/png/204643-200.png" width="100"/>
        <br>
        Hacé click acá para dejar tu feedback sobre esta clase.
      </a>
    </td>
  </tr>
</table>

# Primeros Pasos

#### Preparando tu compu

<!-- Acá vas a encontrar todo lo que necesitas para arrancar el Curso de Preparación.

* [Editor de Texto](./editorTexto.md)
* [Github](./github.md)
* [Git](./git.md)
* [Instalar Node](./node.md) -->

## Instructivo de Primeros Pasos

<div class="iframeContainer">
<iframe src="https://player.vimeo.com/video/638636752" title="Instructivo de Primeros Pasos" allow="autoplay; fullscreen"></iframe>
</div>

> **Importante**: Github cambió el método de autenticación, ahora es por PAT (Personal Access Token), para crearlo pueden seguir este [link](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Pueden elegir expiration infinita para hacerlo una sóla vez.

## Cómo usar SLACK

<div class="iframeContainer">
<iframe src="https://player.vimeo.com/video/548902078" title="Cómo usar SLACK" allow="autoplay; fullscreen; picture-in-picture"></iframe>
</div>

> Gracias [Nico Constantin (FT#12)](https://github.com/NicoConstantin) por el video y la explicación!

## Editores de Texto

Para poder escribir código que pueda ser interpretado por un lenguaje de programación, necesitamos utilizar un editor de texto.

Hay varios, puedes probarlos y optar por el que te sientas más a gusto.

A continuación veremos una lista de los más populares:

### Sublime Text

![Sublime Text](/_src/assets/00-PrimerosPasos/sublimeText_screen.png)

Es un editor de texto liviano, que cuenta con una serie de plugins para adaptarlo a las necesidades de cada desarrollador.

Es multiplataforma, por lo que se puede instalar tanto en Windows, como Linux y OS X.

Para instalarlo, realizaremos los siguientes pasos:

#### En Windows o en OS X

1. Nos dirigimos a la página oficial de [Sublime Text](https://www.sublimetext.com).

2. Al ingresar, detectará automáticamente el sistema operativo que tenemos, y nos sugerirá descargar el instalador apropiado.

3. Presionamos el botón **_Download_**.

4. Elegimos la opción adecuada según nuestro sistema operativo e iniciamos la descarga.

![Sublime Text Download](/_src/assets/00-PrimerosPasos/sublimeText_download.png)

5. Finalizada la descarga, ejecutamos el instalador, seleccionamos las opciones **_siguiente, siguiente, etc_**, hasta completar el proceso.

#### En Linux, en la distribución Ubuntu y derivados

1. Nos dirigimos al sitio oficial de Sublime Text. Aquí encontrarás las instrucciones para instalarlo:

[Descargar Sublime Text para Linux](https://www.sublimetext.com/docs/3/linux_repositories.html)

2. En la terminal, ejecutamos el siguiente comando, para instalar la clave GPG:

```shell
wget -q0 - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
```

3. Para asegurarnos de que `apt` esté configurado para trabajar con orígenes https, ejecutamos:

```shell
sudo apt-get install apt-transport-https
```

4. Luego para agregar el repositorio estable, ejecutamos:

```shell
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
```

5. Finalmente, procedemos a instalar el programa:

```shell
sudo apt-get install sublime-text
```

Ahora, si en el **Menú de inicio** buscamos **Sublime text**, veremos la siguiente imagen:

![Sublime Text Linux](/_src/assets/00-PrimerosPasos/sublimeText_linux.png)

### Atom

![Atom Site](/_src/assets/00-PrimerosPasos/atom_site.png)

Es un editor de código abierto, disponible tanto para Windows, como Linux y para OS X.

Tiene integrada una consola de Git y Github, para llevar un control de versiones de tus proyectos.
Para comenzar el proceso de instalación, realizamos los siguientes pasos:

En Windows, Linux o en OS X, nos dirigimos al sitio oficial, mediante el siguiente enlace:

<https://atom.io/>

Al ingresar, el navegador detecta automáticamente el instalador que necesitamos bajar, según nuestro sistema operativo.

Allí, presionamos el botón Download para almacenarlo en nuestra computadora.

#### En Windows

Una vez finalizada la descarga, hacemos doble click en el instalador y esperamos a que finalice el proceso de instalación.

#### En Ubuntu y derivados

Descomprimimos el instalador, hacemos doble click, y nos dirigimos a: `/usr/bin/atom`

Al hacer doble click, se abrirá el editor.

### Visual Studio Code

![VSC Console](/_src/assets/00-PrimerosPasos/vsc_console.png)

Es un editor desarrollado por Microsoft.

Tiene integrado el control de versiones mediante Git y Github para tener un seguimiento de tus proyectos. Brinda una cantidad de extensiones que facilitan el trabajo de un desarrollador.

Para descargarlo, nos dirigimos al sitio oficial, en la sección Dowload y descargamos el instalador según nuestro Sistema Operativo:

<https://code.visualstudio.com/download>

![VSC Download](/_src/assets/00-PrimerosPasos/vsc_download.png)

Una vez finalizada la descarga, procedemos a ejecutar el instalador.

## Instalando Node.JS

Para instalar Node js en nuestra computadora, nos dirigimos al sitio oficial:

<https://nodejs.org/es/>

Al ingresar, el sitio detectará nuestro Sistema Operativo y nos sugerirá que descarguemos el instalador adecuado.

![Node.JS Screen](/_src/assets/00-PrimerosPasos/nodejs_screen.png)

Para proceder a la descarga, seleccionamos la versión LTS, que es la versión estable.
Una vez finalizada la descarga, procedemos a ejecutar el instalador.

Para corroborar que Node js se instaló correctamente, procedemos a ejecutar el siguiente comando por la consola o terminal de nuestro sistema operativo:

```shell
node -v
```

Y si seguimos los pasos anteriores, la consola o terminal, nos devolverá la versión de Node js que tenemos instalada:

```shell
v12.18.3
```

## Git

### Qué es Git?

Git es un sistema de control de versiones, distribuido y open source. Un control de versiones es un sistema que registra los cambios realizados en un archivo o conjunto de archivos a lo largo del tiempo, de modo que puedas recuperar versiones específicas más adelante.

### Instalación

#### Para Mac y Linux

Ver estos enlaces:

<https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git>

<https://www.youtube.com/watch?v=PSULlxUk744>

<https://www.youtube.com/watch?v=oV0spTF71AI>

#### Para Windows

Ingreso a <https://git-scm.com> y descargo la útlima versión.

![installGit](/_src/assets/00-PrimerosPasos/instalar_window.png)

Una vez descargado, se abre el archivo .exe y van a visualizar la siguiente ventana

![installGit](/_src/assets/00-PrimerosPasos/1.png)

Clickeamos “Next” hasta que llegamos a esta parte:

![installGit](/_src/assets/00-PrimerosPasos/2.png)

En este momento de la instalación si quieres puedes elegir el editor de texto que van a usar. (Importante, ténganlo instalado antes de instalar Git)

Seguimos clickeando “Next” y luego “Install”

![installGit](/_src/assets/00-PrimerosPasos/3.png)

Por último, finalizar! Si seleccionan la opción "Launch Git Bash", una vez que finalizan la instalación se va a abrir la consola

![installGit](/_src/assets/00-PrimerosPasos/4.png)

Otra forma de abrir la consola es haciendo click derecho sobre el escritorio y elegir la opción "Git Bash Here"

![installGit](/_src/assets/00-PrimerosPasos/consola.png)

Una vez instalado Git van a poder visualizar la consola: ingresamos el comando `git --version` para chequear que está instalado. Si ven la consola así, ya están listos para comenzar a trabajar!

![installGit](/_src/assets/00-PrimerosPasos/5.png)

<table class="feedback" width="100%" style='table-layout:fixed;'>
  <tr>
    <td>
      <a href="https://airtable.com/shrSzEYT4idEFGB8d?prefill_clase=00-PrimerosPasos">
        <img src="https://static.thenounproject.com/png/204643-200.png" width="100"/>
        <br>
        Hacé click acá para dejar tu feedback sobre esta clase.
      </a>
    </td>
  </tr>
</table>
