package sh.astrid.ivy.events

import org.bukkit.event.EventHandler
import org.bukkit.event.Listener
import org.bukkit.event.player.PlayerCommandPreprocessEvent
import sh.astrid.ivy.Ivy
import sh.astrid.ivy.util.IvyPlayers
import sh.astrid.ivy.util.send

class CommandEvents(private val plugin: Ivy) : Listener {
    init {
        plugin.server.pluginManager.registerEvents(this, plugin)
    }

    @EventHandler
    fun PlayerCommandPreprocessEvent.onExecute() {
        val authorized = IvyPlayers.isAuthorized(player.uniqueId)

        Ivy.configData.general.blockedCommands.forEach { command ->
            isCancelled = !authorized && message.startsWith(command)
        }

        if(isCancelled) {
            player.send("forbiddenCommand")
            return
        }
    }
}