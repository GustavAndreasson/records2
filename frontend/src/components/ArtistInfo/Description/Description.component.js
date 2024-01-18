import React, { Fragment, useState, useEffect } from "react"
import Artist from "Components/Artist"
import api from "Api"
import "./Description.scss"

const Description = ({ description }) => {
  const [artists, setArtists] = useState({})
  const [labels, setLabels] = useState({})
  const [releases, setReleases] = useState({})
  const [masters, setMasters] = useState({})
  let newArtists = []
  let newLabels = []
  let newReleases = []
  let newMasters = []

  useEffect(() => {
    const fetchData = async dataList => {
      try {
        const response = await api.getMultipleData(dataList)
        if (!response.ok) {
          throw Error(response.statusText)
        }
        const data = await response.json()
        data.artists && setArtists(data.artists)
        data.labels && setLabels(data.labels)
        data.releases && setReleases(data.releases)
        data.masters && setMasters(data.masters)
      } catch (error) {
        console.error(error)
      }
    }
    if (newArtists.length || newLabels.length || newReleases.length || newMasters.length) {
      fetchData({
        artists: newArtists,
        labels: newLabels,
        releases: newReleases,
        masters: newMasters,
      })
    }
  }, [description])

  const tags = [
    {
      name: "a",
      nesting: false,
      generate: node => {
        if (artists[node.value]) {
          return <Artist artist={artists[node.value]} />
        }
        newArtists.push(node.value)
        return <span className="dataitem">{node.value}</span>
      },
    },
    { name: "b", nesting: true, generate: node => <b>{generate(node.children)}</b> },
    { name: "br", nesting: false, generate: node => <br /> },
    {
      name: "g",
      nesting: false,
      generate: node => <span className="dataitem">{"RSG §" + node.value}</span>,
    },
    { name: "i", nesting: true, generate: node => <i>{generate(node.children)}</i> },
    {
      name: "l",
      nesting: false,
      generate: node => {
        if (labels[node.value]) {
          return <span className="dataitem">{labels[node.value].name}</span>
        }
        newLabels.push(node.value)
        return <span className="dataitem">{node.value}</span>
      },
    },
    {
      name: "m",
      nesting: false,
      generate: node => {
        if (masters[node.value]) {
          return <span className="dataitem">{masters[node.value].name}</span>
        }
        newMasters.push(node.value)
        return <span className="dataitem">{node.value}</span>
      },
    },
    {
      name: "r",
      nesting: false,
      generate: node => {
        if (releases[node.value]) {
          return <span className="dataitem">{releases[node.value].name}</span>
        }
        newReleases.push(node.value)
        return <span className="dataitem">{node.value}</span>
      },
    },
    { name: "s", nesting: true, generate: node => <s>{generate(node.children)}</s> },
    { name: "u", nesting: true, generate: node => <u>{generate(node.children)}</u> },
    {
      name: "url",
      nesting: true,
      generate: node => <a href={node.value}>{generate(node.children)}</a>,
    },
  ]

  const tokenize = str => str.match(/[^\[\n]+|\[[^\]]+\]|\n/g).map(t => (t === "\n" ? "[br]" : t))

  const parse = tokens => {
    let nodes = []
    let children = []
    let type = ""
    let value = ""
    let eating = false
    tokens.forEach(token => {
      if (eating) {
        if (token.toLowerCase() === "[/" + type + "]") {
          nodes.push({ type: type, value: value, children: parse(children) })
          eating = false
          children = []
        } else {
          children.push(token)
        }
      } else {
        ;[type, value] = (token.match(/\[([a-zA-Z]+)=?([^\]]*)\]/) || []).slice(1, 3)
        type = type?.toLowerCase()
        if (tags.filter(t => t.nesting).some(t => t.name === type)) {
          eating = true
        } else if (tags.filter(t => !t.nesting).some(t => t.name === type)) {
          nodes.push({ type: type, value: value })
        } else {
          nodes.push({ type: "text", value: token })
        }
      }
    })
    if (eating) {
      nodes.push({ type: type, value: value, children: parse(children) })
    }
    return nodes
  }

  const generate = nodes =>
    nodes.map((node, i) => (
      <Fragment key={i}>
        {node.type === "text" ? node.value : tags.find(t => t.name === node.type).generate(node)}
      </Fragment>
    ))

  return description ? (
    <div className="description">{generate(parse(tokenize(description)))}</div>
  ) : (
    false
  )
}

export default Description
