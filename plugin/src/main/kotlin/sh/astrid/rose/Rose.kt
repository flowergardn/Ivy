package sh.astrid.rose

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlin.reflect.full.memberProperties
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpClient.Version

@Serializable
open class ApiResponse
typealias RoseSerializer = KSerializer<*>

data class RoseResponse<T>(val data: T)
enum class RoseMethod {
    GET, POST, PUT, DELETE
}

val client: HttpClient = HttpClient.newBuilder().build()

private val jsonSerializer = Json {
    ignoreUnknownKeys = true
}

class Request(method: RoseMethod) {
    var url: String = ""
    var headers: Map<String, String> = emptyMap()
    var body: Map<String, Any?> = emptyMap()
    var serializers: List<RoseSerializer> = emptyList()
    var serializer: RoseSerializer? = null
    private val requestMethod = method

    fun send(): RoseResponse<ApiResponse> {
        val bothProvided = serializers.isNotEmpty() && serializer != null

        // Only allow the serializer parameter, or the list of serializers, not both
        require(serializers.isNotEmpty() || serializer != null) { "You must specify either a serializer or a list of serializers." }
        require(!bothProvided) { "You cannot specify both a serializer and a list of serializers." }

        // Adds the single serializer to the list of serializers, for uniformity
        if(serializers.isEmpty() && serializer !== null) {
            serializers = listOf(serializer!!)
        }

        val request = Rose.createRequest(url, requestMethod, this)
        return Rose.handleRequest(request, serializers)
    }
}

/**
 * Rose is a simple HTTP client for Kotlin.
 * It is designed to be easy to use and flexible, allowing you to pass in a variety of response schemas.
 */
object Rose {
    fun get(init: Request.() -> Unit): Request {
        val request = Request(method = RoseMethod.GET)
        request.init()
        return request
    }

    fun post(init: Request.() -> Unit): Request {
        val request = Request(method = RoseMethod.POST)
        request.init()
        return request
    }

    fun put(init: Request.() -> Unit): Request {
        val request = Request(method = RoseMethod.PUT)
        request.init()
        return request
    }

    fun delete(init: Request.() -> Unit): Request {
        val request = Request(method = RoseMethod.DELETE)
        request.init()
        return request
    }

    /**
     * Handles a request by sending it and parsing the response
     * @param request the request to handle
     * @param serializers serializers the serializers to use for the response
     * @return the response
     */
    fun handleRequest(request: HttpRequest.Builder, serializers: List<RoseSerializer>): RoseResponse<ApiResponse> {
        val req = request.build()
        val requestObj = client.send(req, HttpResponse.BodyHandlers.ofString())
        val url = requestObj.uri().toURL().toString()

        try {
            val json = Json.parseToJsonElement(requestObj.body()).jsonObject

            val validSerializer = serializers.firstOrNull { serializer ->
                try {
                    jsonSerializer.decodeFromJsonElement(serializer, json)
                    true
                } catch (e: Exception) {
                    false
                }
            }

            requireNotNull(validSerializer) { "No valid serializer found for request to $url." }

            val response = jsonSerializer.decodeFromJsonElement(validSerializer, json) as ApiResponse
            return RoseResponse(response)
        } catch (e: Exception) {
            throw RuntimeException("Error parsing body during request to $url", e)
        }
    }
    fun createRequest(uri: String, method: RoseMethod, req: Request): HttpRequest.Builder {
        val requestBuilder = HttpRequest.newBuilder().version(Version.HTTP_1_1).uri(URI.create(uri))
        val body = RoseJson.stringify(req.body)

        if(method !== RoseMethod.GET) {
            requestBuilder.header("Content-Type", "application/json")
        }

        when (method) {
            RoseMethod.GET -> requestBuilder.GET()
            RoseMethod.POST -> {
                requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body))
            }
            RoseMethod.PUT -> {
                requestBuilder.PUT(HttpRequest.BodyPublishers.ofString(body))
            }
            RoseMethod.DELETE -> requestBuilder.DELETE()
        }

        req.headers.forEach {
            requestBuilder.header(it.key, it.value)
        }

        return requestBuilder
    }
}

object RoseJson {
    inline fun <reified T : Any> T.toMap(): Map<String, Any?> {
        return T::class.memberProperties.associate { it.name to it.get(this) }
    }

    /**
     * Converts a map to a JSON string
     * @param body the map to convert
     * @return the JSON string
     */
    fun stringify(body: Map<String, Any?>): String {
        val entries = body
            .entries
            .map { entry ->
                escapeString(entry.key) + ": " + when (entry.value) {
                    is Map<*, *> -> stringify(entry.value as Map<String, Any>)
                    is Int, is Boolean -> entry.value
                    is List<*> -> stringifyList(entry.value as List<*>)
                    else -> escapeString(entry.value.toString())
                }
            }

        return "{${entries.joinToString(", ")}}"
    }

    /**
     * Converts a list to a JSON string
     * This is used in recursion within [stringify] method
     * @param list the list to convert
     * @return the JSON string
     */
    private fun stringifyList(list: List<*>): String {
        val elements = list.map {
            when (it) {
                is Map<*, *> -> stringify(it as Map<String, Any>)
                is List<*> -> stringifyList(it)
                is Int, is Boolean -> it
                else -> escapeString(it.toString())
            }
        }
        return "[${elements.joinToString(", ")}]"
    }

    /**
     * Escapes a string to be used in JSON
     * This is used in recursion within [stringify] method
     * @param str the string to escape
     * @return the escaped string
     */
    private fun escapeString(str: String): String {
        return "\"${
            str
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
        }\""
    }
}