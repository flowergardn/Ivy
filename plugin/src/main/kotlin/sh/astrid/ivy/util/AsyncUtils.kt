package sh.astrid.ivy.util

import org.bukkit.scheduler.BukkitTask
import java.util.function.Consumer
import sh.astrid.ivy.Ivy

fun async(code: Consumer<BukkitTask>) {
    Ivy.getInstance().server.scheduler.runTaskAsynchronously(Ivy.getInstance(), code)
}