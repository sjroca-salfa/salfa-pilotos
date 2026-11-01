package com.salfamontajes.hub

data class PortalModel(
    val id: String,
    val num: String,
    val nombre: String,
    val categoria: String,
    val relativePath: String,
    val remoteUrl: String,
    val estado: String = "Activo"
)
