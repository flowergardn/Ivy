package sh.astrid.ivy.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ConfigData(
    val general: GeneralData,
    val customPlaceholders: Map<String, String>,
    val messages: Map<String, String>
)

@Serializable
data class GeneralData(
    val authDuration: Int,
    val blockedCommands: List<String>,
    val apiKey: String,
    val apiUrl: String
)