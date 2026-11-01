package com.salfamontajes.hub

object PortalManager {

    // Base local para desarrollo (10.0.2.2 es localhost desde el emulador de Android)
    var localBaseUrl: String = "http://10.0.2.2:5500/"

    val portales: List<PortalModel> = listOf(
        PortalModel(
            id = "01",
            num = "01",
            nombre = "Mapa de Procesos BPMN",
            categoria = "Operaciones y gestión",
            relativePath = "01-portal-mapa-procesos/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-mapa-procesos/"
        ),
        PortalModel(
            id = "02",
            num = "02",
            nombre = "Control de CV y Competencias",
            categoria = "Gestión de personas",
            relativePath = "02-portal-cv/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-cv/"
        ),
        PortalModel(
            id = "03",
            num = "03",
            nombre = "Salfa Work Management",
            categoria = "Gestión de proyectos y personas",
            relativePath = "03-portal-gestion-proyectos/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-gestion-proyectos/"
        ),
        PortalModel(
            id = "06",
            num = "06",
            nombre = "Salfa Flow · Work Management",
            categoria = "Flujos y tareas corporativas",
            relativePath = "06-portal-salfa-flow/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-salfa-flow/"
        ),
        PortalModel(
            id = "07",
            num = "07",
            nombre = "Autodesk Construction Cloud (ACC)",
            categoria = "BIM & Entorno Común de Datos",
            relativePath = "07-portal-autodesk-construction-cloud-acc/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-acc/"
        ),
        PortalModel(
            id = "08",
            num = "08",
            nombre = "Agente AWP · Tutor & Metodología",
            categoria = "Planificación & Ingeniería CII",
            relativePath = "08-portal-agente-awp/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-agente-awp/"
        ),
        PortalModel(
            id = "05",
            num = "05",
            nombre = "Gestión de la Información",
            categoria = "Gobernanza y series documentales",
            relativePath = "05-portal-gestion-informacion/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-gestion-informacion/"
        ),
        PortalModel(
            id = "04",
            num = "04",
            nombre = "Indicadores OKR",
            categoria = "Planificación estratégica",
            relativePath = "04-portal-indicadores-okr/index.html",
            remoteUrl = "https://sjroca-salfa.github.io/portal-okr/",
            estado = "En desarrollo"
        )
    )

    fun getHubUrl(useLocal: Boolean = true): String {
        return if (useLocal) {
            "${localBaseUrl}00-portal-hub/index.html"
        } else {
            "https://sjroca-salfa.github.io/portal-hub/"
        }
    }

    fun resolvePortalUrl(portal: PortalModel, useLocal: Boolean = true): String {
        return if (useLocal) {
            "${localBaseUrl}${portal.relativePath}"
        } else {
            portal.remoteUrl
        }
    }

    fun findById(id: String): PortalModel? {
        return portales.find { it.id == id || it.num == id }
    }
}
