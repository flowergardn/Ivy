package sh.astrid.ivy.util

import org.bukkit.Bukkit
import sh.astrid.ivy.Ivy
import sh.astrid.ivy.util.IvyAPI.apiKey
import sh.astrid.ivy.util.IvyAPI.baseUrl
import sh.astrid.rose.Rose
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
        val getUser = Rose.get {
            url = "$baseUrl/users/$uuid"
            serializers = listOf(UserResponse.serializer(), ErrorSchema.serializer())
            headers = mapOf("Authorization" to apiKey)
        }

        val userResponse = getUser.send()
        return userResponse.data is UserResponse
    }
}
