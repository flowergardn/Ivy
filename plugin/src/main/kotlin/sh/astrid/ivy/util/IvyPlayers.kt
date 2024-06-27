package sh.astrid.ivy.util

import org.bukkit.Bukkit
import sh.astrid.ivy.Ivy
import java.util.UUID
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

object IvyPlayers {
    private val playerMap = mutableMapOf<UUID, Boolean>()
    private val scheduler = Executors.newScheduledThreadPool(1)

    fun isAuthorized(uuid: UUID): Boolean {
        return playerMap[uuid] ?: false
    }

    fun addAuthorized(uuid: UUID) {
        val duration = Ivy.configData.general.authDuration.seconds

        playerMap[uuid] = true
        scheduler.schedule({
            playerMap.remove(uuid)
            Bukkit.getPlayer(uuid)?.send("expiredSession")
        }, duration.toLong(DurationUnit.SECONDS), TimeUnit.SECONDS)
    }

    fun shutdown() {
        scheduler.shutdown()
    }

    fun ableToAuthorize(uuid: UUID): Boolean {
        var ableTo = false
        async {
            val userResponse = IvyAPI.getUsers.send()
            if (userResponse.data is UsersResponse) {
                val user = userResponse.data.users.find { it.uuid == uuid.toString() }
                ableTo = user != null
            }
        }
        return ableTo
    }
}
