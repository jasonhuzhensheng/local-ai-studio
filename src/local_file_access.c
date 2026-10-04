/* Apple TN3150: allow this service and its children to materialize local files.
 * launchd otherwise inherits OFF, causing EDEADLK before Python can start.
 * This changes only this process tree, not permissions or system settings. */
#include <sys/resource.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: local-file-access COMMAND [ARGS...]\n"); return 2; }
    if (setiopolicy_np(IOPOL_TYPE_VFS_MATERIALIZE_DATALESS_FILES,
                     IOPOL_SCOPE_PROCESS, IOPOL_MATERIALIZE_DATALESS_FILES_ON) != 0) {
        perror("enable file materialization"); return 1;
    }
    execvp(argv[1], &argv[1]);
    perror("exec service"); return 1;
}
