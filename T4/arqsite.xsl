<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    <xsl:variable name="counter"/>
    <xsl:output method="html" encoding="UTF-8" indent="yes"></xsl:output>
    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>
                    <title>Arquivo Arqueológico</title>
                </head>
                <body>
                    <h2>Arquivo Arqueológico</h2>
                    <h3>Índice de Sitios</h3>
                    <ol>
                        <xsl:apply-templates select="//ARQELEM" mode="indice">
                            <xsl:sort select="normalize-space(IDENTI)"
                                lang="iso-8859-1"/>
                        </xsl:apply-templates>
                    </ol>           
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates select="//ARQELEM"> 
            <xsl:sort select="normalize-space(IDENTI)"
                lang="iso-8859-1"/> <!-- era preciso ordenar da mesma forma que os indices para bater certo -->
        </xsl:apply-templates> 
    </xsl:template>
    
    
    <!-- Templates de índicie .....................................-->
    <xsl:template match="ARQELEM" mode="indice">
        
        <li>
            <a name="i{position()}"/>
            <a href="arq{position()}.html">
                <xsl:value-of select="IDENTI"/>    
            </a>
        </li>
        
    </xsl:template>
    
    <!-- Templates para o conteudo .....................................-->
    <xsl:template match="ARQELEM"> 
        
        <xsl:result-document href="site/arq{position()}.html">
            
            <html>
                <head>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body> 
                    <xsl:if test="IDENTI"><p><b>Título:</b><xsl:value-of select="IDENTI"/></p></xsl:if>
                    <xsl:if test="IMAGEM"><p><b>Imagem:</b><xsl:value-of select="IMAGEM/@NOME"/></p></xsl:if>
                    <xsl:if test="DESCRI"><p><b>Descrição:</b><xsl:value-of select="DESCRI"/></p></xsl:if>
                    <xsl:if test="CRONO"><p><b>Época:</b><xsl:value-of select="CRONO"/></p></xsl:if>
                    <xsl:if test="LUGAR"><p><b>Lugar:</b><xsl:value-of select="LUGAR"/></p></xsl:if>
                    <xsl:if test="FREGUE"><p><b>Freguesia:</b><xsl:value-of select="FREGUE"/></p></xsl:if>
                    <xsl:if test="CONCEL"><p><b>Concelho:</b><xsl:value-of select="CONCEL"/></p></xsl:if>
                    <xsl:if test="CODADM"><p><b>CODADM:</b><xsl:value-of select="CODADM"/></p></xsl:if>
                    <xsl:if test="LATITU"><p><b>Latitude:</b><xsl:value-of select="LATITU"/></p></xsl:if>
                    <xsl:if test="LONGIT"><p><b>Longitude:</b><xsl:value-of select="LONGIT"/></p></xsl:if>
                    <xsl:if test="ALTITU"><p><b>Altitude:</b><xsl:value-of select="ALTITU"/></p></xsl:if>
                    <xsl:if test="ACESSO"><p><b>Acesso:</b><xsl:value-of select="ACESSO"/></p></xsl:if>
                    <xsl:if test="QUADRO"><p><b>Quadro:</b><xsl:value-of select="QUADRO"/></p></xsl:if>
                    <xsl:if test="TRAARQ"><p><b>Trabalhos Arqueológicos:</b><xsl:value-of select="TRAARQ"/></p></xsl:if>
                    <xsl:if test="DESARQ"><p><b>Descrição Arqueológica:</b><xsl:value-of select="DESARQ"/></p></xsl:if>
                    <xsl:if test="INTERP"><p><b>Interpretação:</b><xsl:value-of select="INTERP"/></p></xsl:if>
                    <xsl:if test="INTERE"><p><b>Interesse:</b><xsl:value-of select="INTERE"/></p></xsl:if>
                    <xsl:if test="BIBLIO">
                        <xsl:for-each select="BIBLIO">
                            <p><b>Bibliografia:</b><xsl:value-of select="."/></p>
                        </xsl:for-each>
                    </xsl:if>
                    <xsl:if test="AUTOR"><p><b>Autor:</b><xsl:value-of select="AUTOR"/></p></xsl:if>
                    <xsl:if test="DATA"><p><b>Data:</b><xsl:value-of select="DATA"/></p></xsl:if> 
                    <address>
                        [<a href="{position()-1}">Anterior</a>]
                    </address> 
                    <address>
                        [<a href="index.html#i{position()}">Voltar à Home</a>]
                    </address> 
                    <address>
                        [<a href="{position()+1}">Próximo</a>]
                    </address> 
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
</xsl:stylesheet>