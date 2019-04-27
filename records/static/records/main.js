
$(function() {
    if ($("#collection").length) {
        col = new Collection("#collection");
        artists = new ArtistCollection("#artist-info");
        col.artists = artists;
        var user = localStorage.getItem('discogs_username');
        if (user) {
            col.user = user;
            col.loadCollectionCache();
            col.loadCollection(0);
        } else {
            $("#set-collection").show();
        }

        $("#set-collection button").click(function() {
            $("#set-collection").hide();
            col.setCollection($("#set-collection input").val());
        });

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
    self.user = "";
    self.counter = 0;
    self.collection = {};
    self.updated = null;
    self.filters = [{
        attr:"all",
        cmp:"sub",
        val:$("#search").val()
    }];

    function addRecord(record) {
        if (self.collection[record.id]) {
            for (var attr in record) {
                self.collection[record.id][attr] = record[attr];
            }
        } else {
            self.collection[record.id] = record;
        }
        $.each(record.artists, function(id, artist) {
            self.artists.addArtist(artist.artist);
        });
        $.each(record.tracks, function(id, track) {
            $.each(track.artists, function(id, artist) {
                self.artists.addArtist(artist.artist);
            });
        });
        var recordElement = $("#record-" + record.id);
        if (recordElement.length) {
            if (filterRecord(record)) {
                if (!recordElement.is(":visible")) self.counter += 1;
                recordElement.show();
            } else {
                if (recordElement.is(":visible")) self.counter -= 1;
                recordElement.hide();
            }
            recordElement.find(".cover").attr("alt", getArtists(record.artists) + " - " + record.name);
            recordElement.find(".cover").attr("title", getArtists(record.artists) + " - " + record.name);
            recordElement.find(".cover").attr("src", record.thumbnail);
        } else {
            var html = "<div class='record' id='record-" + record.id + "'";
            if (!filterRecord(record)) {
                html += " style='display: none'";
            } else {
                self.counter += 1;
            }
            var formats = "";
            $.each(record.format.split(" "), function(i, format) {
                formats += " format-" + format;
            });
            html += "><img class='cover" + formats + "' src='" + record.thumbnail;
            html += "' alt='" + getArtists(record.artists) + " - " + record.name;
            html += "' title='" + getArtists(record.artists) + " - " + record.name + "'>";
            html += "</div>";
            $(self.div).append(html);
        }
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
        var recordPopup = $("#record-popup");
        var coverImg = recordPopup.find(".cover");
        coverImg.removeAttr("src");
        coverImg.attr("src", record.cover);
        coverImg.attr("alt", getArtists(record.artists) + " - " + record.name);
        coverImg.attr("title", getArtists(record.artists) + " - " + record.name);
        recordPopup.find(".artists").html(getArtists(record.artists, true));
        recordPopup.find(".name").html(record.name);
        recordPopup.find(".format").html(record.format);
        recordPopup.find(".year").html(record.year);
        var tracks = recordPopup.find(".tracks")
        tracks.html("");
        $.each(record.tracks, function(i, track) {
            var html = "<div class='track'><span class='position'>";
            html += track.position + "</span> " + track.name;
            if (track.artists) {
                html += " (" + getArtists(track.artists, true) + ")";
            }
            html += "</div>";
            tracks.append(html);
        });
        var listens = recordPopup.find(".listens");
        listens.children().not(':last').remove();
        var listenSelect = recordPopup.find(".listen-select");
        listenSelect.children().not(':last').remove();
        $.each(record.listens, function(i, listen) {
            var listenElement = $(listen.html);
            listens.children().last().before(listenElement);
            var selectListen = $("<span><img src='" + listen.icon + "'></span>");
            selectListen.click(function() {
                listens.children().hide();
                listenElement.show();
                return false;
            });
            listenSelect.children().last().before(selectListen);
        });

        listens.children().hide();
        listens.children().first().show();
        recordPopup.show();
        var addListenId = function() {
            var type = $(this).data('type');
            $.getJSON(
                "record/" + record.id + "/set/" + type + "/" + recordPopup.find("#listen-id").val(),
            ).done(function(data) {
                self.collection[record.id] = data;
                self.updateCollectionCache(false);
            });
        };
        recordPopup.find(".add-listen input").click(function() {return false;});
        recordPopup.find(".add-listen span").off("click").click(addListenId);
        listenSelect.find("#add-listen").click(function() {
            listens.children().hide();
            listens.find(".add-listen").show();
            return false;
        });
    };

    self.setCollection = function(user) {
        localStorage.setItem("discogs_username", user);
        self.user = user;
        self.collection = {};
        $("#collection").html("");
        self.loadCollectionCache();
        self.loadCollection(0);
    };

    self.loadCollectionCache = function() {
        var collection = JSON.parse(localStorage.getItem("collection." + self.user));
        if (collection) {
            self.updated = collection.updated;
            $.each(collection.collection, function(i, release) {
                addRecord(release);
            });
            $("#counter").text(self.counter);
        }
    }

    self.updateCollectionCache = function(updated) {
        if (updated) {
            self.updated = new Date();
        }
        localStorage.setItem("collection." + self.user,
        JSON.stringify({'collection': self.collection, 'updated': self.updated}));
    }

    self.loadCollection = function(dataLevel) {
        if (dataLevel < 3) {
            var statuses = ["album", "artister", "låtar"]
            $("#status").html("Laddar ner " + statuses[dataLevel] + "...");
            $.getJSON(
                "collection/" + self.user + "/get/" + dataLevel
            ).done(
                function(data) {
                    var count = 0;
                    $.each(data, function(i, release) {
                        addRecord(release);
                        count++;
                    });
                    $("#status").html("");
                    $("#counter").text(self.counter);
                    if (count == 0) {
                        $("#status").html("Ingen discogsanvändare men användarnamn " + self.user);
                        $("#set-collection").show();
                        return;
                    }
                    self.updateCollectionCache(true);
                    self.loadCollection(dataLevel + 1);
                }
            ).fail(function() {
                $("#status").html("ERROR");
            });
        }
    };

    self.updateCollection = function(page) {
        //var pagesize = 100;
        //if (!page) page = 1;
        $("#status").html("Uppdaterar samling");
        $.getJSON(
            "collection/" + self.user + "/update"//,
            //{page:page, page_size:pagesize}
        ).done(
            function(data) {
                $.each(data.releases, function(i, release) {
                    addRecord(release);
                });
                $("#status").html("");
                $("#counter").text(self.counter);
                //if (data.releases && !data.last) {
                //    self.updateCollection(page + 1);
                //}
                self.updateCollectionCache(true);
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
            "artist/" + artistId + "/get"
        ).done(function(data) {
            if (data.updated) {
                addArtistData(data);
            } else {
                $.getJSON(
                    "artist/" + artistId + "/update"
                ).done(function(data) {
                    addArtistData(data);
                });
            }
        });
    }

    return self;
}
