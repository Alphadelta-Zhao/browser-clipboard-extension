<script>
export default {
    name: "Tag",
    props: {
        tags: {
            default: ["default"]
        },
        item: {
            default: {
                id: 0,
                tag: "default",
                content: ""
            }
        }
    },
    data() {
        return {
            current: {
                ...this.item
            }
        }
    },
    methods: {
        changeTag(t) {
            this.current.tag = t
        },
        confirm() {
            const t = {
                edited: !0,
                oldItem: this.item,
                newItem: this.current
            };
            this.$bus.$emit("tagPageCallback", t)
        },
        cancel() {
            const t = {
                edited: !1
            };
            this.$bus.$emit("tagPageCallback", t)
        }
    }   
}
</script>