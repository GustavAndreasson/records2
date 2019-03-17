
$(function() {
    if ($("#collection").length) {
        col = new Collection("#collection");
        artists = new ArtistCollection("#artist-info");

        col.artists = artists;
        col.loadCollection();

        filters = new Filters("#filters", col);
        $("#search").on("input", filters.run);
        $(".add_filter").on("click", function() {
            filters.add(
                $(".new_filter .filter_attribute").val(),
                $(".new_filter .filter_compare").val(),
                $(".new_filter .filter_value").val()
            );
        });
        $(document).on("click", ".remove_filter", filters.remove);

        orders = new Orders("#orders", col);
        $(".add_order").on("click", orders.add);
        $(document).on("click", ".remove_order", orders.remove);

        $("#show_filters").on("click", function() {
            $(".filter_container").toggle();
        });
        $("#show_orders").on("click", function() {
            $(".order_container").toggle();
        });
        $("#reload").on("click", function() {
            col.updateCollection();
        });
        $("#hide-artist").on("click", artists.hideArtist);

        $(document).on("click", ".record", col.showRecord);
        $("#record-popup").on("click", function() {
            $(this).hide();
        });

        $(document).on("click", ".artist", function () {
            artists.showArtist($(this).data("artistId"));
            filters.showArtist($(this).text());
        });
        $(document).on("click", ".year", filters.showYear);
    }
});

function Filters(div, col) {
    var self = this;
    self.div = div;
    self.col = col;

    function clearFilters() {
        $("#search").val("");
        self.col.filters = [{
            attr: "all",
            cmp: "sub",
            val: $("#search").val()
        }];
        $(self.div).html("");
    }

    self.run = function() {
        self.col.filters[0].val = $("#search").val();
        self.col.filter();
    };

    self.add = function(attr, cmp, val) {
        self.col.filters.push({attr: attr, cmp: cmp, val: val});
        var html = "<div class='filter'><span>" + attr + " " + cmp + " " + val;
        html += "</span><button type='button' class='remove_filter'>-</button></div>";
        $(self.div).append(html);
        self.run();
    };

    self.remove = function() {
        self.col.filters.splice($(this).parent(".filter").index() + 1, 1);
        $(this).parent(".filter").remove();
        self.run();
    };

    self.showArtist = function(artist) {
        clearFilters();
        self.add("artist", "eq", artist);
        self.run();
    }

    self.showYear = function() {
        var year = $(this).text();
        clearFilters();
        self.add("year", "eq", year);
        self.run();
    }

    return self;
}

function Orders(div, col) {
    var self = this;
    self.div = div;
    self.col = col;
    self.orders = [];

    self.run = function() {
        self.col.sort(self.orders);
    };

    self.add = function() {
        var attr = $(".new_order .order_attribute").val();
        var rev = $(".new_order .order_reverse")[0].checked;
        self.orders.unshift({attr: attr, dir: (rev ? -1 : 1)});
        var html = "<div class='order'><span>" + attr + " " + (rev ? "&uarr;" : "&darr;");
        html += "</span><button type='button' class='remove_order'>-</button></div>";
        $(self.div).append(html);
        self.run();
    };

    self.remove = function() {
        self.orders.splice(self.orders.length - $(this).parent(".order").index() -1, 1);
        $(this).parent(".order").remove();
        self.run();
    }

    return self;
}


function Collection(div) {
    var self = this;
    self.div = div;
    self.counter = 0;
    self.collection = {};
    self.filters = [{
        attr:"all",
        cmp:"sub",
        val:$("#search").val()
    }];

    function addRecord(record) {
        self.collection[record.id] = record;
        $.each(record.artists, function(id, artist) {
            self.artists.addArtist(artist.artist);
        });
        var html = "<div class='record' id='record-" + record.id + "'";
        if (!filterRecord(record)) {
            html += " style='display: none'";
        } else {
            self.counter += 1;
        }
        html += "><img class='cover format-" + record.format + "' src='" + record.thumbnail;
        html += "' alt='" + getArtists(record.artists) + " - " + record.name;
        html += "' title='" + getArtists(record.artists) + " - " + record.name + "'>";
        html += "</div>";
        $(self.div).append(html);
        return html;
    }

    function filterRecord(record) {
        var comparors = {
            "eq": function(a, b) { return a == b; },
            "neq": function(a, b) { return a != b; },
            "sub": function(a, b) { return a.toLowerCase().indexOf(b.toLowerCase()) >= 0; },
            "lt": function(a, b) { return a <= b; },
            "mt": function(a, b) { return a >= b; }
        };
        var show = true;
        $.each(self.filters, function(j, filter) {
            if (filter.attr == "all") {
                var test = false;
                $.each(record.artists, function(i, artist) {
                    test |= comparors.sub(artist.artist.name, filter.val);
                });
                $.each(record.tracks, function(i, track) {
                    $.each(track.artists, function(j, artist) {
                        test |= comparors.sub(artist.artist.name, filter.val);
                    });
                });
                test |= comparors.sub(record.name, filter.val);
                show &= test;
            } else if (filter.attr == "artist") {
                var test = false;
                $.each(record.artists, function(i, artist) {
                    test |= comparors[filter.cmp](artist.artist.name, filter.val);
                });
                $.each(record.tracks, function(i, track) {
                    $.each(track.artists, function(j, artist) {
                        test |= comparors[filter.cmp](artist.artist.name, filter.val);
                    });
                });
                show &= test;
            } else {
                show &= comparors[filter.cmp](record[filter.attr], filter.val);
            }
        });
        return show;
    }

    function getArtists(artists, html) {
        var artists_str = "";
        var count = 0;
        $.each(artists, function(i, artist) {
            if (html) {
                artists_str += "<span class='artist' data-artist-id='";
                artists_str += artist.artist.id + "'>";
            }
            artists_str += artist.artist.name;
            if (html) artists_str += "</span>";
            count++;
            if (Object.keys(artists).length > count) {
                artists_str += " " + artist.delimiter + " ";
            }
        });
        return artists_str;
    }

    self.showRecord = function() {
        var record = self.collection[$(this).attr("id").substr(7)];
        var html = "<img class='cover format-" + record.format + "' src='" + record.cover;
        html += "' alt='" + getArtists(record.artists) + " - " + record.name;
        html += "' title='" + getArtists(record.artists) + " - " + record.name + "'>";
        html += "<div class='artists'>";
        html += getArtists(record.artists, true);
        html += "</div><div class='name'>";
        html += record.name;
        html += "</div><div class='format'>";
        html += record.format;
        html += "</div><div class='year'>";
        html += record.year;
        html += "</div>";
        $.each(record.tracks, function(i, track) {
            html += "<div class='track'><span class='position'>";
            html += track.position + "</span> " + track.name;
            if (track.artists) {
                html += " (" + getArtists(track.artists, true) + ")";
            }
            html += "</div>";
        });
        $("#record-popup").html(html).show();
    };

    self.setCollection = function(user) {
        $.post("collection/set/" + user);
    };

    self.loadCollection = function() {
        $.getJSON(
            "collection/get"
        ).done(
            function(data) {
                $("#status").html("");
                var count = 0;
                $.each(data, function(i, release) {
                    addRecord(release);
                    count++;
                });
                if (count == 0) {
                    self.updateCollection();
                }
                $("#counter").text(self.counter);
            }
        ).fail(function() {
            $("#status").html("ERROR");
        });
    };

    self.updateCollection = function(page) {
        var pagesize = 100;
        if (!page) page = 1;
        $.getJSON(
            "collection/update",
            {page:page, page_size:pagesize}
        ).done(
            function(data) {
                $("#status").html("");
                $("#loader").show();
                var count = 0;
                $.each(data.releases, function(i, release) {
                    addRecord(release);
                    count++;
                });
                $("#counter").text(self.counter);
                if (data.releases && !data.last) {
                    self.updateCollection(page + 1);
                } else {
                    $("#loader").hide();
                }
            }
        ).fail(function() {
            $("#status").html("ERROR");
        });
    };

    self.filter = function() {
        self.counter = 0;
        $.each(self.collection, function(i, record) {
            if (filterRecord(record)) {
                $("#record-" + record.id).show();
                self.counter += 1;
            } else {
                $("#record-" + record.id).hide();
            }
        });
        $("#counter").text(self.counter);
    };

    self.sort = function(orders) {
        $.each(orders, function(i, order) {
            $(".record").sort(function(a, b) {
                vala = self.collection[$(a).attr("id").substr(7)][order.attr];//$(a).children("." + order.attr).text();
                valb = self.collection[$(b).attr("id").substr(7)][order.attr];//$(b).children("." + order.attr).text();
                if (order.attr == "artists") {
                    vala = getArtists(vala);
                    valb = getArtists(valb);
                }
                if (vala < valb) return -order.dir;
                if (vala > valb) return order.dir;
                return ($(a).index() < $(b).index() ? -1 : 1);
            }).appendTo($(self.div));
        });
    };

    return self;
}

function ArtistCollection(div) {
    var self = this;
    self.div = div;
    self.artists = {};

    self.addArtist = function(artist) {
        self.artists[artist.id] = artist;
    }

    function addArtistData(data) {
        console.log(data);
        if (data.image) $(self.div + " img").attr("src", data.image).show();
        if (data.description) $(self.div + " .description").html(data.description.replace(/\r/g, "<br />")).show();
        if (data.members) {
            $.each(data.members, function(id, member) {
                self.artists[id] = member;
                var memberHtml = "<div class='artist' data-artist-id='";
                memberHtml += id + "'>" + member.artist.name + "</div>";
                $(self.div + " .members").append(memberHtml);
            });
            $(self.div + " .members").show();
        }
        if (data.groups) {
            $.each(data.groups, function(id, group) {
                self.artists[id] = group;
                var groupHtml = "<div class='artist' data-artist-id='";
                groupHtml += id + "'>" + group.artist.name + "</div>";
                $(self.div + " .groups").append(groupHtml);
            });
            $(self.div + " .groups").show();
        }
    }

    self.clearArtist = function() {
        $(self.div + " img").attr("src", "").hide();
        $(self.div + " .description").html("").hide();
        $(self.div + " .members").html("").hide();
        $(self.div + " .groups").html("").hide();
    }

    self.hideArtist = function() {
        self.clearArtist();
        $(self.div).hide();
    }

    self.showArtist = function(artistId) {
        self.clearArtist();
        var artist = self.artists[artistId];
        $(self.div + " .name").html(artist.name);
        $(self.div).show();
        $.getJSON(
            "artist/get/" + artistId
        ).done(function(data) {
            if (data.updated) {
                addArtistData(data);
            } else {
                $.getJSON(
                    "artist/update/" + artistId
                ).done(function(data) {
                    addArtistData(data);
                });
            }
        });
    }

    return self;
}
