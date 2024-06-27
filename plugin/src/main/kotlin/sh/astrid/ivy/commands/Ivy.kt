@file:Command("ivy")

package sh.astrid.ivy.commands
import me.honkling.commando.common.annotations.Command
import org.bukkit.entity.Player
import sh.astrid.ivy.Ivy
import sh.astrid.ivy.util.*

fun ivy(executor: Player) {
    val informationMessage = listOf(
        "",
        "{prefix} <gray>Ivy is an <u><click:open_url:https://github.com/prettyflowerss/Ivy>open source</click></u> two factor authentication plugin for Minecraft.",
        "",
    ).joinToString("\n")
    val parsedMessage = informationMessage.replacePlaceholders().translate()
    executor.sendMessage(parsedMessage)
}

fun add(executor: Player, player: Player) {
    if(!executor.hasPermission("ivy.add")) {
        executor.sendMessage("<red>You lack the permission to use this command.".translate())
        return
    }

    val createSession = IvyAPI.createSession
    createSession.body = mapOf("uuid" to player.uniqueId.toString())

    val sessionResponse = createSession.send()

    if(sessionResponse.data is ErrorSchema) {
        executor.send("errorOccurred", mapOf("error" to sessionResponse.data.error))
        return
    } else if(sessionResponse.data !is SessionResponse) return

    val url = "${Ivy.configData.general.apiUrl}/sessions/${sessionResponse.data.id}"

    val placeholders = mapOf("player" to player.name, "url" to url)

    if(executor.uniqueId !== player.uniqueId) {
        player.send("addRequest", placeholders)
        executor.send("addingUser", placeholders)
    } else {
        player.send("addRequest", placeholders)
    }
}