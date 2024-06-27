package sh.astrid.ivy.util

import net.kyori.adventure.text.Component
import org.bukkit.entity.Player
import sh.astrid.ivy.Ivy

fun String.translate() = Ivy.mm.deserialize(this)

fun getMessage(key: String, placeholders: Map<String, String> = emptyMap()): Component {
    val message = Ivy.configData.messages[key] ?: key
    return message.replacePlaceholders(placeholders).translate()
}

fun Player.send(key: String, placeholders: Map<String, String> = emptyMap()) {
    sendMessage(getMessage(key, placeholders))
}

fun String.replacePlaceholders(map: Map<String, String> = emptyMap(), parenthesis: String = "{}", ignoreCase: Boolean = false) : String {
    val totalPlaceholders = mutableMapOf<String, String>()
    val customPlaceholders = Ivy.configData.customPlaceholders.toMap()

    customPlaceholders.forEach {
        totalPlaceholders[it.key] = it.value.toString()
    }
    totalPlaceholders.putAll(map)

    var placeholded = this
    for (value in totalPlaceholders) {
        placeholded = placeholded.replace("${parenthesis[0]}${value.key}${parenthesis[1]}", value.value, ignoreCase)
    }
    return placeholded
}