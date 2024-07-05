package sh.astrid.ivy.util

import sh.astrid.rose.Rose
import kotlinx.serialization.Serializable
import sh.astrid.ivy.Ivy
import sh.astrid.rose.ApiResponse

@Serializable
data class ErrorSchema(
    val error: String,
) : ApiResponse()

@Serializable
data class SuccessfulAuthorization(
    val success: Boolean,
) : ApiResponse()

@Serializable
data class User(
    val uuid: String,
)

@Serializable
data class UserResponse(
    val uuid: String,
) : ApiResponse()

@Serializable
data class UsersResponse(
    val users: List<User>
): ApiResponse()

@Serializable
data class SessionResponse(
    val id: String
) : ApiResponse()

@Serializable
data class AuthorizationBody(
    val code: String,
    val uuid: String,
)

object IvyAPI {
    val baseUrl = Ivy.configData.general.apiUrl
    val apiKey = Ivy.configData.general.apiKey

    val validateToken = Rose.put {
        url = "$baseUrl/authorize"
        serializers = listOf(SuccessfulAuthorization.serializer(), ErrorSchema.serializer())
        headers = mapOf("Authorization" to apiKey)
    }

    val getUsers = Rose.get {
        url = "$baseUrl/users"
        serializers = listOf(UsersResponse.serializer(), ErrorSchema.serializer())
        headers = mapOf("Authorization" to apiKey)
    }

    val createSession = Rose.post {
        url = "$baseUrl/sessions"
        serializers = listOf(SessionResponse.serializer(), ErrorSchema.serializer())
        headers = mapOf("Authorization" to apiKey)
    }
}
