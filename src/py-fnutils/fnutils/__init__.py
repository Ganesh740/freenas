#+
# Copyright 2015 iXsystems, Inc.
# All rights reserved
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted providing that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
# IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
# OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
# STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
# IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
#####################################################################


import copy


def first_or_default(f, iterable, default=None):
    i = filter(f, iterable)
    if i:
        return i[0]

    return default


def exclude(d, *keys):
    return {k: v for k, v in d.items() if k not in keys}


def materialized_paths_to_tree(lst, separator='.'):
    result = {'children': {}, 'path': []}

    def add(parent, path):
        if not path:
            return

        p = path.pop(0)
        c = parent['children'].get(p)
        if not c:
            c = {'children': {}, 'path': parent['path'] + [p], 'label': p}
            parent['children'][p] = c

        add(c, path)

    for i in lst:
        path = i.split(separator)
        add(result, path)

    return result


def template(d, **kwargs):
    if isinstance(d, dict):
        result = {}
        for k, v in d.items():
            result[template(k, **kwargs)] = template(v, **kwargs)

        return result

    if isinstance(d, list):
        result = []
        for i in d:
            result.append(template(i, **kwargs))

        return result

    if isinstance(d, int):
        return d

    if isinstance(d, basestring):
        return d.format(d, **kwargs)
