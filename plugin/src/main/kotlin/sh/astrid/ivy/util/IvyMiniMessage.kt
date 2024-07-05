package sh.astrid.ivy.util

import net.kyori.adventure.text.format.TextColor
import net.kyori.adventure.text.minimessage.MiniMessage
import net.kyori.adventure.text.minimessage.tag.Tag
import net.kyori.adventure.text.minimessage.tag.resolver.TagResolver
import net.kyori.adventure.text.minimessage.tag.standard.StandardTags

class IvyMiniMessage {
    fun build(): MiniMessage {
        val format = mutableListOf<TagResolver>()

        fun addDefaultColorCode(code: String, color: String) {
            format.add(createBasicColorResolver(code, color))
        }

        addDefaultColorCode("p", "#ffd4e3")
        addDefaultColorCode("s", "#ffb5cf")
        addDefaultColorCode("t", "#6b5569")

        val resolvers = TagResolver.resolver(
            StandardTags.defaults(),
            *format.toTypedArray()
        )

        val builder = MiniMessage.builder()
            .tags(resolvers)

        return builder.build()
    }

    private fun createBasicColorResolver(name: String, color: String) =
        TagResolver.resolver(name, Tag.styling(TextColor.fromHexString(color)!!))
}