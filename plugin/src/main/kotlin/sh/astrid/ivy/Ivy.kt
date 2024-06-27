package sh.astrid.ivy

import cc.ekblad.toml.decode
import cc.ekblad.toml.tomlMapper
import me.honkling.commando.spigot.SpigotCommandManager
import net.kyori.adventure.text.minimessage.MiniMessage
import org.bukkit.plugin.java.JavaPlugin
import sh.astrid.ivy.data.ConfigData
import sh.astrid.ivy.events.CommandEvents
import sh.astrid.ivy.util.IvyMiniMessage
import sh.astrid.ivy.util.IvyPlayers

class Ivy : JavaPlugin() {
    lateinit var mm: MiniMessage
    lateinit var configData: ConfigData

    fun reloadConfigs() {
        val mapper = tomlMapper {}
        dataFolder.mkdir()

        val fileConfigs = listOf(
            "config.toml",
        )

        fileConfigs.forEach { configFile ->
            val configPath = dataFolder.resolve(configFile)
            saveResource(configFile, false)
            when (configFile) {
                "config.toml" -> configData = mapper.decode(configPath.toPath())
            }
        }
    }

    override fun onEnable() {
        mm = IvyMiniMessage().build()

        reloadConfigs()
        registerEvents()

        val commandManager = SpigotCommandManager(this, true)
        commandManager.registerCommands("sh.astrid.ivy.commands")
    }

    private fun registerEvents() {
        CommandEvents(this)
    }

    override fun onDisable() {
        IvyPlayers.shutdown()
    }

    companion object {
        fun getInstance(): Ivy {
            return getPlugin(Ivy::class.java)
        }

        var mm: MiniMessage
            get() = getInstance().mm
            set(value) {
                getInstance().mm = value
            }

        var configData: ConfigData
            get() = getInstance().configData
            set(value) {
                getInstance().configData = value
            }
    }
}