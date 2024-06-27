@file:Command(
    "authorize",
    permission = "ivy.authorize",
)

package sh.astrid.ivy.commands

import me.honkling.commando.common.annotations.Command
import org.bukkit.entity.Player
import sh.astrid.ivy.util.*
import sh.astrid.rose.RoseJson.toMap

fun authorize(executor: Player, code: String) {
    if(!IvyPlayers.ableToAuthorize(executor.uniqueId)) {
        executor.send("notSetup")
        return
    }

    val isAuthorized = IvyPlayers.isAuthorized(executor.uniqueId)

    if(isAuthorized) {
        executor.send("alreadyAuthorized")
        return
    }

   async {
       val validateTokenEndpoint = IvyAPI.validateToken
       validateTokenEndpoint.body = AuthorizationBody(code, executor.uniqueId.toString()).toMap()

       val validToken = validateTokenEndpoint.send()

       if(validToken.data is ErrorSchema) {
           executor.send("errorOccurred", mapOf("error" to validToken.data.error))
           return@async
       }

       executor.send("successfulAuthorization")
       IvyPlayers.addAuthorized(executor.uniqueId)
   }
}