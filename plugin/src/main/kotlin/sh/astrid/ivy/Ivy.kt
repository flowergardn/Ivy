package sh.astrid.ivy

import cc.ekblad.toml.decode
import cc.ekblad.toml.tomlMapper
import me.honkling.commando.spigot.SpigotCommandManager
import net.kyori.adventure.text.minimessage.MiniMessage
import org.bukkit.Bukkit
import org.bukkit.plugin.java.JavaPlugin
import sh.astrid.ivy.data.ConfigData
import sh.astrid.ivy.events.CommandEvents
import sh.astrid.ivy.util.IvyMiniMessage
import sh.astrid.ivy.util.IvyPlayers

const val GITHUB_URL = "https://github.com/prettyflowerss/Ivy"

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
        checkAPIKey()

        if(configData.general.debugMode) {
            logger.info("Ivy is in debug mode, so you'll see a lot of information in the console.")
        }

        val commandManager = SpigotCommandManager(this, configData.general.debugMode)
        commandManager.registerCommands("sh.astrid.ivy.commands")
    }

    private fun checkAPIKey() {
        val apiKey = Ivy.configData.general.apiKey
        val apiUrl = Ivy.configData.general.apiUrl

        if(apiKey.isBlank() || apiKey == "API_KEY") {
            logger.warning("Hey there! In order to use Ivy, you need to get an API key from $apiUrl. Read our documentation ($GITHUB_URL) for more information.")
            Bukkit.getPluginManager().disablePlugin(this)
        }
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